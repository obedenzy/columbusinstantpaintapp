import React from 'react';
import { Paintbrush, Home, Building, Store, ChevronRight } from 'lucide-react'; // Example icons

// Existing services data (can be expanded or modified)
export const services = [
  {
    id: 'residential',
    title: 'Residential Interior Painting',
    description: 'Transform your living spaces with fresh coats of paint, from single rooms to entire homes.',
    image: 'https://afptpimxlqmtxmdcvjtv.supabase.co/storage/v1/object/public/paint//Residential%20Interior%20Painting.png', 
    icon: <Home size={24} className="text-brand-orange" />,
  },
  {
    id: 'exterior',
    title: 'Residential Exterior Painting',
    description: 'Boost curb appeal and protect your property with our expert exterior painting services.',
    image: 'https://afptpimxlqmtxmdcvjtv.supabase.co/storage/v1/object/public/paint//Residential%20Exterior%20Painting.png', 
    icon: <Building size={24} className="text-brand-orange" />,
  },
  {
    id: 'kitchen-cabinets',
    title: 'Kitchen Cabinet Painting',
    description: 'Revitalize your kitchen without the cost of replacement. We provide expert cleaning, sanding, priming, and application for a durable, smooth, and factory-like finish on your cabinets.',
    image: 'https://afptpimxlqmtxmdcvjtv.supabase.co/storage/v1/object/public/paint//kitchen%20cabinet%20painting.jpg', // Placeholder, replace with actual image URL
    icon: <Paintbrush size={24} className="text-brand-orange" />,
  },
  {
    id: 'patio-deck', // Changed from 'commercial'
    title: 'Patio/Deck Painting & Staining', // Changed title
    description: 'Revitalize your outdoor living spaces. We clean, prep, and apply high-quality paint or stain to patios and decks, protecting them from the elements and enhancing their appearance.', // Changed description
    image: 'https://afptpimxlqmtxmdcvjtv.supabase.co/storage/v1/object/public/paint//Patio%20and%20Deck%20Painting%20&%20Staining.jpg', // New placeholder image
    icon: <Paintbrush size={24} className="text-brand-orange" />, // Changed icon, Store might not be relevant
  },
  {
    id: 'Fence Painting',
    title: 'Fence Painting',
    description: 'Protect and beautify your wooden, vinyl, or metal fences with our durable painting and staining services, enhancing longevity and curb appeal.',
    image: 'https://afptpimxlqmtxmdcvjtv.supabase.co/storage/v1/object/public/paint//fence%20painting.jpg',
    icon: <Paintbrush size={24} className="text-brand-orange" />,
  },
  {
    id: 'Mailbox Painting',
    title: 'Mailbox Painting',
    description: 'Give your mailbox a fresh, weather-resistant finish. Our service includes cleaning, rust treatment, and a high-quality paint application.',
    image: 'https://afptpimxlqmtxmdcvjtv.supabase.co/storage/v1/object/public/paint//Mailbox%20Painting.jpg',
    icon: <Paintbrush size={24} className="text-brand-orange" />,
  },
  // {
  //   id: 'floor', // Kept 'floor' as ID, title is more specific
  //   title: 'Garage Floor Coating and Painting',
  //   description: 'Durable and aesthetic floor coatings for garages, basements, workshops, and commercial spaces, including epoxy and concrete paints.',
  //   image: 'https://afptpimxlqmtxmdcvjtv.supabase.co/storage/v1/object/public/paint//Garage%20Floor%20Coating%20and%20Painting.webp', 
  //   icon: <Paintbrush size={24} className="text-brand-orange" />,
  // },
];

const DreamPainting: React.FC = () => {
  return (
    <section id="services" className="py-16 bg-brand-gray-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="section-tag">Services</span>
          <h2 className="text-4xl font-bold text-brand-text-dark">
            Our Exclusive <span className="text-brand-orange">Painting Services</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
              <img src={service.image} alt={service.title} className="w-full h-56 object-cover" />
              <div className="p-6 bg-brand-teal-dark text-white flex-grow flex flex-col">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-brand-orange rounded-full mr-3">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                </div>
                <p className="text-gray-300 text-sm mb-4 flex-grow">{service.description}</p>
                <a href="#pricing" className="text-brand-orange font-semibold hover:underline self-start text-sm">
                  View Details &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          {/* <a
            href="#contact"
            className="bg-brand-orange text-white font-semibold px-8 py-3 rounded-md hover:bg-opacity-90 transition-colors text-lg"
          >
            View All Services <ChevronRight size={20} className="inline ml-1" />
          </a> */}
        </div>
      </div>
    </section>
  );
};

export default DreamPainting;
