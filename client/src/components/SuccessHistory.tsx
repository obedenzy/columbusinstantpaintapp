import React from 'react';
import { PlayCircle } from 'lucide-react';

const SuccessHistory: React.FC = () => {
  return (
    <section id="history" className="py-16 bg-white"> {/* Added ID */}
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Our Painting Services Success History {/* Updated heading */}
          </h2>
          <p className="text-gray-600 mb-6">
            With over 15 years of experience, Columbus Paint Pros has been delivering exceptional painting services throughout the Columbus metro area. We specialize in residential and commercial painting projects of all sizes. {/* Updated paragraph 1 */}
          </p>
          <p className="text-gray-600 mb-8">
            Our team consists of skilled, licensed professionals who take pride in their craftsmanship. We use only premium paints and materials to ensure lasting results that stand the test of time. As a locally owned and operated business, we understand the unique needs of Columbus homeowners and businesses. Our commitment to quality, reliability, and customer satisfaction has made us a trusted name in the painting industry. {/* Updated paragraph 2 */}
          </p>
          {/* <div className="flex items-center space-x-6">
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-md text-lg">
              Read More
            </button>
            <div className="flex items-center space-x-2 text-gray-800 font-semibold">
              <PlayCircle size={40} className="text-orange-500" />
              <span>Call Us <br /> +123 567 898</span>
            </div>
          </div> */}
        </div>
        <div className="relative">
          <img
            src="https://afptpimxlqmtxmdcvjtv.supabase.co/storage/v1/object/public/paint//5.png" // Replaced image URL
            alt="Columbus Paint Pros Success History" // Updated alt text for SEO
            className="rounded-lg shadow-lg"
          />
          {/* <div className="absolute inset-0 flex items-center justify-center">
            <PlayCircle size={80} className="text-orange-500 cursor-pointer opacity-80 hover:opacity-100 transition-opacity" />
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default SuccessHistory;
