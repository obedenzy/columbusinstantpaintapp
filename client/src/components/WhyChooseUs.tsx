import React from 'react';
import { CheckCircle, Users, Award, Shield, ChevronRight } from 'lucide-react';

const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: <CheckCircle size={24} className="text-brand-orange" />,
      title: 'Quality Materials',
      description: 'We use premium, eco-friendly paints and materials for lasting, beautiful results.',
    },
    {
      icon: <Users size={24} className="text-brand-orange" />,
      title: 'Experienced Team',
      description: 'Our skilled painters are trained, insured, and dedicated to craftsmanship.',
    },
    {
      icon: <Award size={24} className="text-brand-orange" />,
      title: 'On-Time & On-Budget',
      description: 'We respect your schedule and provide transparent pricing with no hidden fees.',
    },
    {
      icon: <Shield size={24} className="text-brand-orange" />,
      title: 'Satisfaction Guaranteed',
      description: 'Your happiness is our priority. We stand by our work with a satisfaction guarantee.',
    },
  ];

  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="section-tag">About Us</span>
          <h2 className="text-4xl font-bold text-brand-text-dark">
            Your Trusted <span className="text-brand-orange">Painting Partner</span>
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            At Instant Paint Columbus, we're more than just painters. We're a team of passionate professionals committed to transforming spaces and exceeding expectations.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 relative">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://afptpimxlqmtxmdcvjtv.supabase.co/storage/v1/object/public/paint//painter%20at%20work.png"
                alt="Painter at work"
                className="rounded-lg shadow-lg col-span-2 h-64 w-full object-cover"
              />
              <img
                src="https://afptpimxlqmtxmdcvjtv.supabase.co/storage/v1/object/public/paint//team%20painting.png"
                alt="Team painting"
                className="rounded-lg shadow-lg h-48 w-full object-cover"
              />
              <div className="bg-brand-teal-dark text-white p-6 rounded-lg shadow-lg flex flex-col justify-center items-start h-48">
                <h3 className="text-2xl font-bold mb-2">24/7 Support</h3>
                <p className="text-sm text-gray-200 mb-3">
                  Always here to help with your painting needs and inquiries.
                </p>
                <a href="#contact" className="text-brand-orange font-semibold hover:underline text-sm">
                  Contact Us &rarr;
                </a>
              </div>
            </div>
          </div>

          <div className="md:w-1/2">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-brand-text-dark mb-2">Our Story</h3>
                <p className="text-gray-600">
                  Founded with a passion for color and craftsmanship, Instant Paint Columbus has grown into a leading painting service provider, built on trust and quality.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-brand-text-dark mb-2">Our Mission</h3>
                <p className="text-gray-600">
                  To deliver exceptional painting services that enhance the beauty and value of every property, ensuring complete client satisfaction through professionalism and expertise.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-brand-text-dark mb-2">What Sets Us Apart</h3>
                <ul className="space-y-2">
                  {features.slice(0,2).map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 mr-3 mt-1">{feature.icon}</div>
                      <div>
                        <h4 className="font-semibold">{feature.title}</h4>
                        <p className="text-gray-500 text-sm">{feature.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* <a
              href="#contact"
              className="mt-8 inline-block bg-brand-orange text-white font-semibold px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors"
            >
              More About Us <ChevronRight size={18} className="inline ml-1" />
            </a> */}
          </div>
        </div>
        <div className="mt-16">
            <h3 className="text-3xl font-bold text-brand-text-dark text-center mb-10">Why Choose Instant Paint Columbus?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((reason, index) => (
                <div key={index} className="bg-brand-gray-light p-6 rounded-lg shadow-md text-center flex flex-col items-center">
                <div className="mb-4">{reason.icon}</div>
                <h4 className="text-xl font-semibold text-brand-text-dark mb-2">{reason.title}</h4>
                <p className="text-gray-600 text-sm">{reason.description}</p>
                </div>
            ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
