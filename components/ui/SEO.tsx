import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  schema?: Record<string, any>;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  noindex?: boolean;
  canonicalUrl?: string;
}

const BASE_URL = 'https://viktron.ai';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

export const SEO: React.FC<SEOProps> = ({
  title = 'Viktron | AI Automation Agency & Agentic AI Solutions',
  description = 'Viktron is a leading AI automation agency specializing in agentic AI solutions, AI chatbots, voice agents, WhatsApp automation, and intelligent business process automation. Transform your business with custom AI agents that work 24/7.',
  keywords = 'AI automation agency, agentic AI, AI agents, AI chatbots, voice AI agents, WhatsApp automation, AI voice agents, business automation, AI consulting, custom AI solutions, conversational AI, AI process automation, intelligent automation, AI for business',
  image = DEFAULT_IMAGE,
  url = BASE_URL,
  type = 'website',
  schema,
  article,
  noindex = false,
  canonicalUrl
}) => {
  const siteTitle = title.includes('Viktron.ai') ? title : `${title} | Viktron.ai`;
  const finalUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
  const finalCanonical = canonicalUrl || finalUrl;
  const finalImage = image.startsWith('http') ? image : `${BASE_URL}${image}`;

  // Default Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    "name": "Viktron.ai",
    "alternateName": ["Viktron AI Agency", "Viktron AI Automation", "Viktron Agentic AI"],
    "url": BASE_URL,
    "logo": {
      "@type": "ImageObject",
      "url": `${BASE_URL}/viktron-icon.svg`,
      "width": 512,
      "height": 512
    },
    "image": DEFAULT_IMAGE,
    "description": "Viktron is a leading AI automation agency specializing in agentic AI solutions, custom AI agents, voice automation, chatbots, and intelligent business process automation for businesses of all sizes.",
    "email": "info@viktron.ai",
    "telephone": "+1-844-660-8065",
    "sameAs": [
      "https://www.tiktok.com/@viktron",
      "https://www.facebook.com/profile.php?id=61582587125978",
      "https://www.instagram.com/viktron.ai/",
      "https://www.youtube.com/@viktron",
      "https://x.com/viktronai",
      "https://wa.me/+18446608065"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-844-660-8065",
      "contactType": "customer service",
      "email": "info@viktron.ai",
      "availableLanguage": ["English"]
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Chicago",
        "containedInPlace": {
          "@type": "State",
          "name": "Illinois"
        }
      },
      {"@type": "AdministrativeArea", "name": "Cook County, IL"},
      {"@type": "AdministrativeArea", "name": "DuPage County, IL"},
      {"@type": "AdministrativeArea", "name": "Lake County, IL"},
      {"@type": "AdministrativeArea", "name": "Will County, IL"},
      {"@type": "AdministrativeArea", "name": "Kane County, IL"},
      {"@type": "AdministrativeArea", "name": "McHenry County, IL"},
      {"@type": "AdministrativeArea", "name": "Kendall County, IL"},
      {"@type": "AdministrativeArea", "name": "Grundy County, IL"},
      {"@type": "AdministrativeArea", "name": "DeKalb County, IL"},
      {"@type": "Country", "name": "United States"}
    ],
    "knowsAbout": [
      "Artificial Intelligence",
      "AI Automation",
      "Agentic AI",
      "AI Chatbots",
      "Voice AI Agents",
      "Conversational AI",
      "Business Process Automation",
      "WhatsApp Automation",
      "AI Video Agents",
      "Marketing Automation",
      "AI Consulting"
    ]
  };

  // LocalBusiness Schema for Local SEO
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/#localbusiness`,
    "name": "Viktron",
    "image": DEFAULT_IMAGE,
    "url": BASE_URL,
    "telephone": "+1-844-660-8065",
    "email": "info@viktron.ai",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Chicago",
      "addressRegion": "IL",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "41.8781",
      "longitude": "-87.6298"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://www.tiktok.com/@viktron",
      "https://www.facebook.com/profile.php?id=61582587125978",
      "https://www.instagram.com/viktron.ai/",
      "https://www.youtube.com/@viktron",
      "https://x.com/viktronai"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "AI Automation Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AI Chat Agents"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AI Voice Agents"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "WhatsApp & SMS Automation"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Business Process Automation"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AI Video Agents"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AI Consulting & Strategy"
          }
        }
      ]
    }
  };

  // WebPage Schema
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": type === 'article' ? 'Article' : 'WebPage',
    "@id": `${finalUrl}#webpage`,
    "url": finalUrl,
    "name": siteTitle,
    "description": description,
    "isPartOf": { "@id": `${BASE_URL}/#website` },
    "publisher": { "@id": `${BASE_URL}/#organization` },
    "inLanguage": "en-US",
    "dateModified": new Date().toISOString().split('T')[0],
    ...(article && {
      "datePublished": article.publishedTime,
      "dateModified": article.modifiedTime || article.publishedTime,
      "author": { "@type": "Person", "name": article.author || "Viktron" },
      "articleSection": article.section,
      "keywords": article.tags?.join(', ')
    })
  };

  // Breadcrumb schema based on URL
  const pathSegments = finalUrl.replace(BASE_URL, '').split('/').filter(Boolean);
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
      ...pathSegments.map((segment, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        "item": `${BASE_URL}/${pathSegments.slice(0, index + 1).join('/')}`
      }))
    ]
  };

  const finalSchemas = schema
    ? [schema, organizationSchema, localBusinessSchema, breadcrumbSchema]
    : [organizationSchema, localBusinessSchema, webPageSchema, breadcrumbSchema];

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="title" content={siteTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={finalCanonical} />
      
      {/* Robots */}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      <meta name="googlebot" content={noindex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'} />
      
      {/* AI Search Optimization Meta Tags */}
      <meta name="ai-content-description" content={description} />
      <meta name="ai-business-info" content={`Company: Viktron.ai - AI Automation Agency | Services: AI Chatbots, Voice AI Agents, WhatsApp Automation, Video Agents, Business Process Automation, AI Consulting | Specialization: Agentic AI Solutions | Contact: info@viktron.ai | Phone: +1 (844) 660-8065`} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={siteTitle} />
      <meta property="og:site_name" content="Viktron" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={finalUrl} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:site" content="@viktron" />
      <meta name="twitter:creator" content="@viktron" />

      {/* Article specific meta tags */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          <meta property="article:modified_time" content={article.modifiedTime || article.publishedTime} />
          <meta property="article:author" content={article.author || 'Viktron'} />
          <meta property="article:section" content={article.section} />
          {article.tags?.map((tag, i) => (
            <meta key={i} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Structured Data / JSON-LD */}
      {finalSchemas.map((schemaItem, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schemaItem)}
        </script>
      ))}

      {/* Additional Performance & SEO hints */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#0a0a0f" />
    </Helmet>
  );
};

// Export specialized SEO components for common pages
export const ServiceSEO: React.FC<{ serviceName: string; serviceDescription: string }> = ({ 
  serviceName, 
  serviceDescription 
}) => (
  <SEO
    title={`${serviceName} | AI Services | Viktron`}
    description={serviceDescription}
    keywords={`${serviceName}, AI Services, Business Automation, Viktron`}
    url={`/services`}
    schema={{
      "@context": "https://schema.org",
      "@type": "Service",
      "name": serviceName,
      "description": serviceDescription,
      "provider": {
        "@type": "Organization",
        "name": "Viktron"
      },
      "areaServed": "Worldwide"
    }}
  />
);

export const AgentSEO: React.FC<{ agentName: string; industry: string }> = ({ 
  agentName, 
  industry 
}) => (
  <SEO
    title={`${agentName} AI Agent | ${industry} Industry | Viktron`}
    description={`Specialized AI agent for ${industry.toLowerCase()} businesses. Automate customer interactions, bookings, and inquiries with our ${agentName}.`}
    keywords={`${industry} AI, ${agentName}, AI Agent, ${industry} Automation, Business Chatbot`}
    url={`/demos/${industry.toLowerCase().replace(/\s+/g, '-')}`}
  />
);
