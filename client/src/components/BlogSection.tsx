import React from 'react';
import { ChevronRight, Calendar } from 'lucide-react';

interface BlogPost {
  image: string;
  date: string;
  title: string;
  excerpt: string;
  link: string;
}

const blogPosts: BlogPost[] = [
  {
    image: 'https://afptpimxlqmtxmdcvjtv.supabase.co/storage/v1/object/public/paint//blog-post-1.jpg', // Replace
    date: '26 Jan',
    title: 'Choosing the Right Paint Finish for Your Home',
    excerpt: 'Gloss, satin, matte? Understanding paint sheens can be tricky. We break down the pros and cons of each...',
    link: '#',
  },
  {
    image: 'https://afptpimxlqmtxmdcvjtv.supabase.co/storage/v1/object/public/paint//blog-post-2.jpg', // Replace
    date: '15 Feb',
    title: 'Top Color Trends for Interior Painting in 2025',
    excerpt: 'Discover the hottest color palettes that will dominate interior design this year and bring your home to life.',
    link: '#',
  },
  {
    image: 'https://afptpimxlqmtxmdcvjtv.supabase.co/storage/v1/object/public/paint//blog-post-3.jpg', // Replace
    date: '05 Mar',
    title: 'DIY vs. Professional Painting: When to Hire Experts',
    excerpt: 'Thinking of a DIY paint job? We explore the benefits of hiring professionals for a flawless, lasting finish.',
    link: '#',
  },
];

const BlogSection: React.FC = () => {
  return (
    <section id="blog" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="section-tag">Blog</span>
          <h2 className="text-4xl font-bold text-brand-text-dark">
            Our Latest <span className="text-brand-orange">Blog Posts</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <div key={index} className="bg-brand-gray-light rounded-lg shadow-lg overflow-hidden flex flex-col">
              <div className="relative">
                <img src={post.image} alt={post.title} className="w-full h-56 object-cover" />
                <div className="absolute top-4 left-4 bg-brand-orange text-white text-xs font-semibold px-3 py-1.5 rounded">
                  <Calendar size={14} className="inline mr-1" /> {post.date}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-brand-text-dark mb-3 hover:text-brand-orange transition-colors">
                  <a href={post.link}>{post.title}</a>
                </h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow">{post.excerpt}</p>
                <a
                  href={post.link}
                  className="text-brand-orange font-semibold hover:underline self-start text-sm"
                >
                  Learn More <ChevronRight size={16} className="inline" />
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <a
            href="#" // Link to a dedicated blog page
            className="bg-brand-orange text-white font-semibold px-8 py-3 rounded-md hover:bg-opacity-90 transition-colors text-lg"
          >
            View All Posts <ChevronRight size={20} className="inline ml-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
