import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, keywords }) => {
  useEffect(() => {
    // 1. Update document title
    const formattedTitle = title ? `${title} | AUI` : 'AUI - Animation Industry Network';
    document.title = formattedTitle;

    // 2. Update document meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    
    const fallbackDescription = 'A private network connecting studios, institutes, and professionals in the animation industry.';
    metaDescription.setAttribute('content', description || fallbackDescription);

    // 3. Update document meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    
    const fallbackKeywords = 'animation, studios, talent, hiring, recruitment, animators, portfolio, portfolio link';
    metaKeywords.setAttribute('content', keywords || fallbackKeywords);
  }, [title, description, keywords]);

  return null;
};

export default SEO;
