import React from 'react';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link

export const pricingTiers = [
  {
    title: 'Residential Interior Painting',
    price: '$600-$1,000',
    unit: 'per room',
    features: [
      'Expert color matching & consultation',
      'Meticulous surface preparation (sanding, priming)',
      'Clean lines & smooth, even coverage',
      'Protection of all furniture & flooring',
      'Post-painting cleanup & inspection',
    ],
    bgColor: 'bg-white',
    textColor: 'text-brand-text-dark',
    buttonClass: 'bg-brand-orange text-white hover:bg-opacity-90',
  },
  {
    title: 'Residential Exterior Painting',
    price: '$600-$1,000',
    unit: '',
    features: [
      'High-performance, weather-resistant paints',
      'Thorough power washing & surface cleaning',
      'Scraping, sanding, and priming of all surfaces',
      'Caulking of cracks & gaps for weatherproofing',
      'Careful protection of landscaping & non-paint areas',
    ],
    bgColor: 'bg-brand-orange', // Highlighted plan
    textColor: 'text-white',
    buttonClass: 'bg-white text-brand-orange hover:bg-gray-100',
  },
 {
    title: 'Kitchen Cabinet Painting',
    price: '$65-$85',
 unit: 'per door',
    features: [
      'Expert surface degreasing and cleaning',
      'Detailed sanding and priming for adhesion',
      'Smooth, factory-like finish application',
      'Protection of surrounding areas',
      'Choice of colors and finishes',
    ],
    bgColor: 'bg-white',
    textColor: 'text-brand-text-dark',
 buttonClass: 'bg-brand-orange text-white hover:bg-opacity-90',
  },
  {
    title: 'Patio/Deck Painting & Staining', // Changed title
    price: '$2.00 - $3.00', // Example price
    unit: '/sq. ft', // Example unit
    features: [
      'Thorough Cleaning & Mildew Removal',
      'Deck/Patio Surface Repair & Sanding',
      'Premium Weatherproof Stains & Paints',
      'Non-Slip Coating Options Available',
      'UV Protection for Color Longevity',
    ],
    bgColor: 'bg-white',
    textColor: 'text-brand-text-dark',
    buttonClass: 'bg-brand-orange text-white hover:bg-opacity-90',
  },
	 {
    title: 'Fence Painting',
    price: '$160-$350',
    unit: 'for a 8 ft fence (both sides)',
    features: [
      'High-Quality Wood/Metal Stains & Paints',
      'Thorough Cleaning & Mildew Removal',
      'Repair of Minor Fence Damage',
      'Even Application for Uniform Coverage',
      'Enhanced Durability & Weather Protection',
    ],
    bgColor: 'bg-white',
    textColor: 'text-brand-text-dark',
    buttonClass: 'bg-brand-orange text-white hover:bg-opacity-90',
  },
  {
    title: 'Mailbox Painting',
    price:  '$75-$125',
   unit: 'per mailbox',
    features: [
      'Rust Treatment & Prevention',
      'Premium All-Weather Enamel Paint',
      'Crisp Lettering/Numbering (Optional)',
      'Quick Turnaround, Lasting Finish',
      'Boosts Curb Appeal Instantly',
    ],
    bgColor: 'bg-brand-orange', // Highlighted plan
    textColor: 'text-white',
    buttonClass: 'bg-white text-brand-orange hover:bg-gray-100',
  },
  // {
  //   title: 'Garage Floor Coating and Painting',
  //   price: '$2.00-$3.00',
  //   unit: '/sq. ft',
  //   features: [
  //     'Industrial-Grade Epoxy/Polyaspartic Coatings',
  //     'Concrete Grinding & Crack Repair',
  //     'Resistant to Oil, Chemicals & Hot Tires',
  //     'Custom Color Flake Options Available',
  //     'Anti-Slip Finish for Safety',
  //   ],
  //   bgColor: 'bg-white',
  //   textColor: 'text-brand-text-dark',
  //   buttonClass: 'bg-brand-orange text-white hover:bg-opacity-90',
  // }
];

const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="py-16 bg-brand-teal-dark text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="section-tag bg-brand-teal-medium text-gray-200">Pricing</span>
          <h2 className="text-4xl font-bold">
            Transparent Pricing for <span className="text-brand-orange">Quality Services</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {pricingTiers.map((tier, index) => (
            <div
              key={index}
              className={`rounded-lg shadow-xl p-8 flex flex-col ${tier.bgColor} ${tier.textColor} ${index === 1 ? 'transform lg:scale-105 z-10' : ''}`} // Highlight middle card
            >
              <h3 className="text-2xl font-bold mb-2">{tier.title}</h3>
              <div className="mb-6">
                <span className={`text-5xl font-extrabold ${tier.bgColor === 'bg-brand-orange' ? 'text-white' : 'text-brand-orange'}`}>{tier.price}</span>
                <span className="text-lg ml-1">{tier.unit}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <CheckCircle size={18} className={`mr-2 ${tier.bgColor === 'bg-brand-orange' ? 'text-white' : 'text-brand-orange'}`} />
                    {feature}
                  </li>
                ))}
              </ul>
              {/* Updated to use Link and point to /book-now */}
              <Link
                to="/book-now"
                className={`w-full text-center font-semibold py-3 px-6 rounded-md transition-colors text-lg ${tier.buttonClass}`}
              >
                Book Now <ChevronRight size={20} className="inline ml-1" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
