import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  ogType
}) => {
  useEffect(() => {
    // 1. Update document title
    const formattedTitle = title ? `${title} | AUI` : 'AUI - Animation Industry Network';
    document.title = formattedTitle;

    // Helper to create or update a meta tag
    const updateMeta = (nameAttr: 'name' | 'property', attrValue: string, contentValue: string | undefined, fallback: string = '') => {
      let element = document.querySelector(`meta[${nameAttr}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentValue || fallback);
    };

    // 2. Standard Meta Tags
    const fallbackDescription = 'A private network connecting studios, institutes, and professionals in the animation industry.';
    updateMeta('name', 'description', description, fallbackDescription);

    const fallbackKeywords = 'animation, studios, talent, hiring, recruitment, animators, portfolio, portfolio link';
    updateMeta('name', 'keywords', keywords, fallbackKeywords);

    // 3. Open Graph Meta Tags
    if (ogTitle || title) {
      updateMeta('property', 'og:title', ogTitle || title);
    }
    if (ogDescription || description) {
      updateMeta('property', 'og:description', ogDescription || description, fallbackDescription);
    }
    if (ogImage) {
      updateMeta('property', 'og:image', ogImage);
    }
    if (ogUrl) {
      updateMeta('property', 'og:url', ogUrl);
    }
    if (ogType) {
      updateMeta('property', 'og:type', ogType, 'website');
    }
  }, [title, description, keywords, ogTitle, ogDescription, ogImage, ogUrl, ogType]);

  return null;
};

export default SEO;
