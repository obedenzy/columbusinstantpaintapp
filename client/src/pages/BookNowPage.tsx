import React from 'react';
import FreeQuote from '../components/FreeQuote';

const BookNowPage: React.FC = () => {
  // Update document title for SEO, ideally using a library like react-helmet-async for better SPA SEO
  React.useEffect(() => {
    document.title = "Book Painting Service | Instant Paint Columbus | Free Quote";
  }, []);

  return (
    <main>
      <section className="py-12 bg-brand-gray-light text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-brand-text-dark mb-4">
            Book Your Painting Service with <span className="text-brand-orange">Instant Paint Columbus</span>
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
            Ready to transform your space? Get an instant estimate and schedule your professional painting service today. Our expert team at Instant Paint Columbus is committed to delivering top-quality results for your home or business. Fill out the form below to get started!
          </p>
        </div>
      </section>
      <FreeQuote />
      <section className="py-12 bg-white text-center">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-brand-text-dark mb-4">Why Choose Us for Your Next Painting Project?</h2>
            <ul className="list-disc list-inside text-left max-w-xl mx-auto text-gray-700 space-y-2">
                <li><strong>Fast & Easy Online Booking:</strong> Get your project scheduled in minutes.</li>
                <li><strong>Transparent Pricing:</strong> Instant estimates with no hidden fees.</li>
                <li><strong>Experienced Professionals:</strong> Skilled and insured painters dedicated to quality.</li>
                <li><strong>Quality Materials:</strong> We use premium paints for a durable, beautiful finish.</li>
                <li><strong>Satisfaction Guaranteed:</strong> We're not happy until you're thrilled with the results.</li>
            </ul>
        </div>
      </section>
    </main>
  );
};

export default BookNowPage;
