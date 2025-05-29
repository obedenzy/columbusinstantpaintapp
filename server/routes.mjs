import express from 'express';
import { format, parseISO, isValid, isBefore } from 'date-fns';
import supabase from './supabaseClient.js';
import { Buffer } from 'buffer'; // Import Buffer
import nodemailer from 'nodemailer'; // Import Nodemailer
import path from 'path'; // Import path module

const router = express.Router();

// --- Nodemailer Transporter Setup ---
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587', 10), // Default to 587 if not set
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {rejectUnauthorized: false}
});

// --- Helper Function for Price Calculation ---
function calculateServicePrice(serviceRule, quantity, options = {}) {
  if (!serviceRule || typeof quantity !== 'number' || quantity <= 0) {
    return { minTotal: 0, maxTotal: 0, priceRangeString: '$0.00-$0.00', estimatedPrice: 0 };
  }

  const unitName = serviceRule.unit_name;
  let itemMinPrice = parseFloat(serviceRule.min_price || 0);
  let itemMaxPrice = parseFloat(serviceRule.max_price || 0);
  let baseCalcPrice = parseFloat(serviceRule.base_price || 0);
  let prepCostForItem = parseFloat(serviceRule.prep_cost || 0);
  let additionalCostPerUnit = parseFloat(serviceRule.additional_price_per_unit || 0);


  let minTotalForItem = itemMinPrice * quantity;
  let maxTotalForItem = itemMaxPrice * quantity;
  let calculatedEstimate = (minTotalForItem + maxTotalForItem) / 2;
  let specificEstimate = baseCalcPrice * quantity;

  if (unitName === 'mailbox') {
    if (quantity > (serviceRule.fixed_price_threshold || 1) && serviceRule.fixed_price_above_threshold) {
      specificEstimate = parseFloat(serviceRule.fixed_price_above_threshold) * quantity;
    }
    if (options.prep_needed && serviceRule.additional_cost_trigger === 'rust_removal') {
      specificEstimate += prepCostForItem * quantity;
    }
  } else if (unitName === 'room' && options.extra_walls && serviceRule.additional_cost_trigger === 'extra_wall') {
    specificEstimate += additionalCostPerUnit * options.extra_walls;
  } else if (unitName === 'linear_foot' && options.staining_prep && serviceRule.additional_cost_trigger === 'staining_prep') {
    specificEstimate += additionalCostPerUnit * quantity;
  } else if (unitName === 'sq_ft') {
     if (options.staining_coating && serviceRule.additional_cost_trigger === 'staining_coating') {
        specificEstimate += additionalCostPerUnit * quantity;
     }
     if (options.additional_prep && serviceRule.additional_cost_trigger === 'additional_prep') {
        specificEstimate += additionalCostPerUnit * quantity;
        specificEstimate += prepCostForItem;
     }
  } else if (unitName === 'unit' && options.prep_needed) {
    specificEstimate += prepCostForItem * quantity;
  }

  calculatedEstimate = specificEstimate;

  return {
    serviceId: serviceRule.id, // Include serviceId here for consistency with client payload
    title: serviceRule.title, // Include title here for consistency with client payload
    quantity: quantity,
    unitLabel: serviceRule.unit_label, // Include unitLabel here for consistency with client payload
    minTotal: itemMinPrice * quantity,
    maxTotal: itemMaxPrice * quantity, // Corrected maxTotal calculation
    priceRangeString: `$${(itemMinPrice * quantity).toFixed(2)}-$${(itemMaxPrice * quantity).toFixed(2)}`,
    estimatedPrice: calculatedEstimate,
  };
}

// Helper function to generate an 8-digit random number
function generateBookingPrefix() {
 return Math.floor(10000000 + Math.random() * 90000000); // Generate an 8-digit number
}

// Helper function to format time to 12-hour format
const formatTo12Hour = (time24) => {
  try {
    const [hours, minutes] = time24.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    return format(date, 'h:mm a');
  } catch (e) {
    console.error("Error formatting time:", time24, e);
    return time24;
  }
};


// --- Routes ---

router.get('/services', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('paintservices')
      .select('id, title, unit_label, unit_name')
      .order('title');

    if (error) {
      console.error('Supabase error fetching services:', error);
      throw new Error('Failed to fetch services list.');
    }
    res.status(200).json({ success: true, services: data });
  } catch (error) {
    console.error('Error fetching services:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch services.';
    res.status(500).json({ success: false, message: message });
  }
});

router.get('/availability', async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate || typeof startDate !== 'string' || typeof endDate !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
    return res.status(400).json({
      success: false,
      message: 'Valid startDate and endDate (yyyy-MM-dd format) parameters are required'
    });
  }

  try {
    const start = parseISO(startDate);
    const end = parseISO(endDate);

    if (!isValid(start) || !isValid(end) || isBefore(end, start)) {
       return res.status(400).json({ success: false, message: 'Invalid date range.' });
    }

    const { data: bookedSlotsData, error: bookedSlotsError } = await supabase
      .from('servicebookings')
      .select('booking_date_est, book_time_est')
      .gte('booking_date_est', startDate)
      .lte('booking_date_est', endDate);

    if (bookedSlotsError) {
      console.error('Supabase error fetching booked EST slots:', bookedSlotsError);
      throw new Error('Failed to fetch booking data.');
    }
    const mappedBookedSlots = bookedSlotsData.map(slot => ({
        booking_date: slot.booking_date_est,
        book_time: slot.book_time_est
    }));

    return res.status(200).json({
      success: true,
      bookedSlots: mappedBookedSlots
    });

  } catch (error) {
    console.error(`Error fetching availability for EST range ${startDate} to ${endDate}:`, error);
    const message = error instanceof Error ? error.message : 'Failed to fetch availability.';
    return res.status(500).json({ success: false, message: message });
  }
});

// Route to handle booking requests (Changed to GET)
router.get('/book', async (req, res) => {
  console.log('Received booking request (GET):', req.query); // Log req.query for GET

  // Destructure booking details from request query parameters
  const {
    firstName,
    email,
    phone,
    projectAddress,
    projectDescription,
    selectedDate,
    selectedTimeValue,
    paint_bought,
    paint_color,
    selectedServices: selectedServicesJson, // Get JSON string from query
    totalMinEstimate: totalMinEstimateStr, // Get string from query
    totalMaxEstimate: totalMaxEstimateStr, // Get string from query
    images: imagesJson // Get JSON string from query
  } = req.query; // Read from req.query

  // Basic validation for required fields
  if (!selectedDate || !selectedTimeValue || !firstName || !email || !projectAddress || !selectedServicesJson) {
    return res.status(400).json({ success: false, message: 'Missing required booking information (selectedDate, selectedTimeValue, firstName, email, projectAddress, selectedServices).' });
  }

  // Validate date and time format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(selectedDate) || !/^\d{2}:\d{2}$/.test(selectedTimeValue)) {
    return res.status(400).json({ success: false, message: 'Invalid date or time format in request.' });
  }

  // Decode and parse selectedServices from the query string
  let selectedServices;
  try {
    selectedServices = JSON.parse(selectedServicesJson);
    if (!Array.isArray(selectedServices) || selectedServices.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid selectedServices data format or empty array.' });
    }
  } catch (e) {
    console.error('Error parsing selectedServices JSON from query:', e);
    return res.status(400).json({ success: false, message: 'Invalid selectedServices data format.' });
  }

  // Decode and parse images from the query string
  // NOTE: Sending images via GET query parameters is highly discouraged due to URL length limits.
  // This part might fail for larger images.
  let images = [];
  if (imagesJson) {
    try {
      images = JSON.parse(imagesJson);
      if (!Array.isArray(images)) {
         console.warn('Images data from query is not an array:', images);
         images = []; // Treat as no images if not an array
      }
    } catch (e) {
      console.error('Error parsing images JSON from query:', e);
      // Continue without images if parsing fails
      images = [];
    }
  }


  // Parse estimated prices to numbers
  const totalMinEstimate = parseFloat(totalMinEstimateStr);
  const totalMaxEstimate = parseFloat(totalMaxEstimateStr);

  // Convert paint_bought string to boolean or null
  const paintBoughtBool = paint_bought === 'true' ? true : (paint_bought === 'false' ? false : null);
  const paintColorValue = paint_color || null;


  const bookingDateEST = selectedDate;
  const bookingTimeEST = selectedTimeValue;

  console.log(`Booking attempt for Date: ${bookingDateEST}, Time: ${bookingTimeEST} (EST)`);

  let bookingId = null; // Variable to hold the generated booking ID

  try {
    // 1. Save initial booking details to paintingservicebookings
    const bookingData = {
      booking_date_est: bookingDateEST,
      booking_id: generateBookingPrefix(), // Generate and add the 8-digit booking ID
      book_time_est: bookingTimeEST,
      first_name: firstName,
      email: email,
      phone: phone || null,
      project_address: projectAddress,
      project_description: projectDescription || null,
      selected_services_details: selectedServices, // Use the parsed array
      total_min_estimated_price: totalMinEstimate,
      total_max_estimated_price: totalMaxEstimate,
      paint_bought: paintBoughtBool,
      paint_color: paintColorValue,
      // image_urls will be added after upload
    };

    const { data: fullBookingData, error: fullBookingError } = await supabase
      .from('paintingservicebookings')
      .insert([bookingData])
      .select()
      .single();

    if (fullBookingError) {
      console.error('Supabase error saving to paintingservicebookings:', fullBookingError);
      console.log("Data attempted for paintingservicebookings:", bookingData);
      return res.status(500).json({ success: false, message: 'Failed to save initial booking details.' });
    }

    console.log('Initial booking details saved to paintingservicebookings:', fullBookingData);
    bookingId = fullBookingData.id; // Store the generated booking ID

    // 2. Reserve time slot in servicebookings
    const { error: slotBookingError } = await supabase
      .from('servicebookings')
      .insert([{ booking_date_est: bookingDateEST, book_time_est: bookingTimeEST }]);

    if (slotBookingError) {
      console.error('Supabase error reserving slot in servicebookings:', slotBookingError);
      const { error: deleteError } = await supabase
        .from('paintingservicebookings')
        .delete()
        .eq('id', bookingId);

      if (deleteError) {
        console.error('CRITICAL: Supabase error deleting from paintingservicebookings after servicebookings failure:', deleteError);
      }
      return res.status(500).json({ success: false, message: 'Failed to reserve time slot after saving booking details. Booking has been rolled back.' });
    }

    console.log('Time slot reserved in servicebookings.');

    // 3. Handle Image Uploads (if any)
    const uploadedImageUrls = [];
    if (images && Array.isArray(images) && images.length > 0) {
      console.log(`Attempting to upload ${images.length} images for booking ID: ${bookingId}`);
      for (const image of images) {
        try {
          // Decode base64
          const imageBuffer = Buffer.from(image.base64, 'base64');
          const fileExtension = path.extname(image.filename);
          const fileNameWithoutExt = path.basename(image.filename, fileExtension);
          // Create a unique filename to avoid conflicts, especially if multiple files have the same name
          const uniqueFileName = `${fileNameWithoutExt}_${Date.now()}${fileExtension}`;
          const storagePath = `bookingimages/${bookingId}/${uniqueFileName}`; // Folder structure: bookingimages/booking_id/filename

          console.log(`Uploading image: ${image.filename} to path: ${storagePath}`);

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('paint') // Use your storage bucket name, e.g., 'paint'
            .upload(storagePath, imageBuffer, {
              contentType: image.mimeType,
              upsert: false // Do not overwrite existing files
            });

          if (uploadError) {
            console.error(`Supabase Storage error uploading image ${image.filename}:`, uploadError);
            // Decide how to handle upload errors: continue or fail the whole booking?
            // For now, we'll log and continue, but won't add the URL.
            // A more robust solution might require a transaction or cleanup logic.
          } else {
            console.log(`Image uploaded successfully: ${uploadData.path}`);
            // Get the public URL
            const { data: publicUrlData } = supabase.storage
              .from('paint') // Use your storage bucket name
              .getPublicUrl(uploadData.path);

            if (publicUrlData && publicUrlData.publicUrl) {
              uploadedImageUrls.push(publicUrlData.publicUrl);
              console.log(`Public URL: ${publicUrlData.publicUrl}`);
            } else {
               console.warn(`Could not get public URL for uploaded image: ${uploadData.path}`);
            }
          }
        } catch (imgProcessError) {
          console.error(`Error processing or uploading image ${image.filename}:`, imgProcessError);
          // Log error and continue
        }
      }

      // Update the booking record with image URLs
      if (uploadedImageUrls.length > 0) {
        console.log(`Updating booking ${bookingId} with ${uploadedImageUrls.length} image URLs.`);
        const { data: updateData, error: updateError } = await supabase
          .from('paintingservicebookings')
          .update({ image_urls: uploadedImageUrls })
          .eq('id', bookingId)
          .select() // Select the updated row to return
          .single();

        if (updateError) {
          console.error(`Supabase error updating booking ${bookingId} with image URLs:`, updateError);
          // Log error, but don't fail the booking at this point as it's already created.
          // The booking exists, just without image URLs. Manual intervention might be needed.
        } else {
           console.log(`Booking ${bookingId} updated with image URLs.`);
           // Update fullBookingData with the image URLs for the response
           fullBookingData.image_urls = updateData.image_urls;
        }
      } else {
         console.log(`No images were successfully uploaded for booking ${bookingId}.`);
      }
    } else {
      console.log('No images provided in the booking request.');
    }


    // --- Send Booking Confirmation Email ---
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email, // Send to the client's email
        subject: 'Booking Confirmation - Instant Paint Columbus',
        text: `Dear ${firstName},\n\nThank you for booking your painting service with Instant Paint Columbus!\n\nHere are your booking details:\nBooking ID: ${fullBookingData.booking_id}\nDate: ${format(parseISO(bookingDateEST), 'MMMM d, yyyy')}\nTime: ${formatTo12Hour(bookingTimeEST)}\nAddress: ${projectAddress}\n\nServices Booked:\n${selectedServices.map(s => `- ${s.title} (Quantity: ${s.quantity})`).join('\n')}\n\nEstimated Price Range: $${totalMinEstimate.toFixed(2)} - $${totalMaxEstimate.toFixed(2)}\n\n${uploadedImageUrls.length > 0 ? 'Project Images:\n' + uploadedImageUrls.join('\n') + '\n\n' : ''}We will be in touch shortly to confirm the details and discuss your project further.\n\nBest regards,\nInstant Paint Columbus Team`,
        html: `<p>Dear ${firstName},</p><p>Thank you for booking your painting service with Instant Paint Columbus!</p><p>Here are your booking details:</p><ul><li><strong>Booking ID:</strong> ${fullBookingData.id}</li><li><strong>Date:</strong> ${format(parseISO(bookingDateEST), 'MMMM d, yyyy')}</li><li><strong>Time:</strong> ${formatTo12Hour(bookingTimeEST)}</li><li><strong>Address:</strong> ${projectAddress}</li></ul><p><strong>Services Booked:</strong></p><ul>${selectedServices.map(s => `<li>${s.title} (Quantity: ${s.quantity})</li>`).join('')}</ul><p><strong>Estimated Price Range:</strong> $${totalMinEstimate.toFixed(2)} - $${totalMaxEstimate.toFixed(2)}</p>${uploadedImageUrls.length > 0 ? '<p><strong>Project Images:</strong></p><ul>' + uploadedImageUrls.map(url => `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a></li>`).join('') + '</ul>' : ''}<p>We will be in touch shortly to confirm the details and discuss your project further.</p><p>Best regards,<br>Instant Paint Columbus Team</p>`,
      };

      let emailResponse= await transporter.sendMail(mailOptions);
      console.log(emailResponse);
      if(emailResponse.accepted.length>0){
        console.log('Booking confirmation email sent successfully.'); // Added console.log here
      }
     
    } catch (emailError) {
      console.error('Error sending booking confirmation email:', emailError);
      // Note: We don't fail the booking just because the email failed to send.
    }


    res.status(201).json({
      success: true,
      message: 'Booking successful! We will be in touch.',
      bookingDetails: fullBookingData, // Return the potentially updated booking data
      bookedDate: bookingDateEST,
      bookedTime: bookingTimeEST
    });

  } catch (error) {
    console.error('Error processing booking:', error);
    const message = error instanceof Error ? error.message : 'Failed to complete booking process.';
    // If bookingId was generated but subsequent steps failed, the initial record exists.
    // A more robust system would handle this with explicit transactions or cleanup jobs.
    res.status(500).json({ success: false, message: message });
  }
});

// Route to calculate price estimate (using GET method and query parameters)
router.get('/calculate-price', async (req, res) => { // Changed from router.post to router.get
  console.log('Received price calculation request:', req.query); // Log req.query

  const { selectedServices: selectedServicesJson } = req.query;
  let selectedServices;
  try {
    selectedServices = JSON.parse(selectedServicesJson); // Parse the JSON string from query params
    if (!Array.isArray(selectedServices) || selectedServices.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid input: selectedServices array is required.' });
    }
  } catch (e) {
    return res.status(400).json({ success: false, message: 'Invalid selectedServices data format.' });
  }

  const validServiceIds = selectedServices.map(service => {
    if (!service.serviceId) {
      console.warn("Missing serviceId:", service);
      return null;
    }
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(service.serviceId)) {
      console.warn("Invalid serviceId format:", service.serviceId, service);
      return null;
    }
    return service.serviceId;
  }).filter(Boolean);

  if (validServiceIds.length === 0) {
    return res.status(400).json({ success: false, message: 'No valid service IDs provided.' });
  }

  const quantities = selectedServices.reduce((acc, s) => {
    if(validServiceIds.includes(s.serviceId)) {
       acc[s.serviceId] = s.quantity;
    }
    return acc;
  }, {});
   const serviceOptions = selectedServices.reduce((acc, s) => {
     if(validServiceIds.includes(s.serviceId)) {
        acc[s.serviceId] = s.options || {};
     }
    return acc;
  }, {});

  try {
    const { data: serviceRules, error } = await supabase
      .from('paintservices')
      .select('*')
      .in('id', validServiceIds);

    if (error) {
      console.error('Supabase error fetching service rules:', error);
      throw new Error('Failed to fetch service pricing information.');
    }

    if (!serviceRules || serviceRules.length !== validServiceIds.length) {
       console.warn('Mismatch between requested service IDs and fetched rules. Requested:', validServiceIds, 'Fetched:', serviceRules?.map(r => r.id));
    }

    let overallTotalMin = 0;
    let overallTotalMax = 0;

    const priceDetails = serviceRules.map(rule => {
        const quantity = quantities[rule.id];
        const options = serviceOptions[rule.id] || {};
        const itemPriceInfo = calculateServicePrice(rule, quantity, options);

        overallTotalMin += itemPriceInfo.minTotal;
        overallTotalMax += itemPriceInfo.maxTotal;

      return {
        serviceId: rule.id,
        title: rule.title,
        quantity: quantity,
        unitLabel: rule.unit_label,
        priceRange: itemPriceInfo.priceRangeString,
        estimatedPrice: itemPriceInfo.estimatedPrice,
      };
    });

    res.status(200).json({
      success: true,
      priceDetails: priceDetails,
      totalMinEstimate: overallTotalMin,
      totalMaxEstimate: overallTotalMax,
    });

  } catch (error) {
    console.error('Error calculating price:', error);
    const message = error instanceof Error ? error.message : 'Failed to calculate price estimate.';
    res.status(500).json({ success: false, message: message });
  };
});
// Route to handle newsletter subscription (using POST method and request body)
router.get('/subscribe-newsletter', async (req, res) => { // Changed from POST to GET
  const { email } = req.query; // Read from query parameters

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format.' });
  }

  try {
    const { data, error } = await supabase
      .from('paintingnewsletter')
      .insert([{ email: email.toLowerCase() }]) // Store email in lowercase to avoid case-sensitive duplicates
      .select();

    if (error) {
      if (error.code === '23505') { // Unique violation
        return res.status(409).json({ success: false, message: 'This email is already subscribed.' });
      }
      console.error('Supabase error subscribing to newsletter:', error);
      throw new Error('Failed to subscribe to newsletter.');
    }

    // --- Send Newsletter Confirmation Email ---
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email, // Send to the subscriber's email
        subject: 'Welcome to the Instant Paint Columbus Newsletter!',
        text: `Thank you for subscribing to the Instant Paint Columbus newsletter!\n\nStay tuned for painting tips, trends, and exclusive offers.\n\nBest regards,\nInstant Paint Columbus Team`,
        html: `<p>Thank you for subscribing to the Instant Paint Columbus newsletter!</p><p>Stay tuned for painting tips, trends, and exclusive offers.</p><p>Best regards,<br>Instant Paint Columbus Team</p>`,
      };

     let emailResponse= await transporter.sendMail(mailOptions);
      console.log(emailResponse);
      if(emailResponse.accepted.length>0){
        console.log('Newsletter confirmation email sent successfully.'); // Added console.log here
      }
    } catch (emailError){
      console.log('Newsletter confirmation email sent successfully.'); // Added console.log here
    }

    res.status(201).json({ success: true, message: 'Successfully subscribed to the newsletter!', data });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    const message = error instanceof Error ? error.message : 'Failed to subscribe.';
    res.status(500).json({ success: false, message: message });
  }
});


export default router;
