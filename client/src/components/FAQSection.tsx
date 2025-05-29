import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  toggleOpen: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, toggleOpen }) => {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={toggleOpen}
        className="w-full flex justify-between items-center py-5 px-6 text-left text-lg font-medium text-brand-text-dark hover:bg-brand-gray-light focus:outline-none"
      >
        <span>{question}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <div className="px-6 pb-5 text-gray-600">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const faqsData = [
  {
    question: 'How long does a typical painting project take?',
    answer: 'Project duration varies based on size and complexity. Small interior jobs might take 1-2 days, while larger exterior projects could take a week or more. We provide a detailed timeline with our quote.',
  },
  {
    question: 'Do I need to move furniture before you start?',
    answer: 'We recommend moving smaller, valuable items. Our team can assist with larger furniture, covering it carefully to protect it from paint and dust.',
  },
  {
    question: 'What kind of paint do you use?',
    answer: 'We use high-quality, durable paints from reputable brands like Sherwin-Williams, Benjamin Moore, PPG, ensuring a long-lasting and beautiful finish. We also offer eco-friendly and low-VOC options.',
  },
  {
    question: 'Are you insured and licensed?',
    answer: 'Yes, Instant Paint Columbus is fully licensed and insured for your peace of mind. We prioritize safety and professionalism on every job site.',
  },
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Open first FAQ by default

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="section-tag">FAQs</span>
          <h2 className="text-4xl font-bold text-brand-text-dark">
            Frequently Asked <span className="text-brand-orange">Questions</span>
          </h2>
        </div>
        <div className="max-w-3xl mx-auto bg-brand-gray-light rounded-lg shadow-lg overflow-hidden">
          {faqsData.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              toggleOpen={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
