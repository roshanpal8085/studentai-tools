import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, canonical, ogImage, ogType = 'website', schema }) => {
  const siteTitle = "StudentAI Tools - Best AI Study Tools for Students";
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const defaultDescription = "Free AI-powered study tools for students. Resume builder, homework helper, essay writer, PDF utilities, and more. Boost your productivity with StudentAI.";
  const metaDescription = description || defaultDescription;
  const url = `https://studentaitools.in${canonical || ''}`;

  const globalSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://studentaitools.in/#organization",
        "name": "StudentAI Tools",
        "url": "https://studentaitools.in",
        "logo": { "@type": "ImageObject", "url": "https://studentaitools.in/logo.png" },
        "sameAs": ["https://github.com/roshanpal"],
        "founder": {
          "@type": "Person",
          "name": "Roshan Pal",
          "jobTitle": "Founder & Lead Engineer",
          "url": "https://studentaitools.in/about"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://studentaitools.in/#website",
        "url": "https://studentaitools.in",
        "name": "StudentAI Tools",
        "description": "Free AI-powered study tools for students across India and the world.",
        "publisher": { "@id": "https://studentaitools.in/#organization" },
        "potentialAction": {
          "@type": "SearchAction",
          "target": { "@type": "EntryPoint", "urlTemplate": "https://studentaitools.in/blog?q={search_term_string}" },
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />

      {/* E-E-A-T: Authorship & Crawl Directives */}
      <meta name="author" content="Roshan Pal, StudentAI Tools" />
      <meta name="publisher" content="StudentAI Tools" />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta httpEquiv="content-language" content="en-IN" />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="StudentAI Tools" />
      <meta property="og:locale" content="en_IN" />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogImage && <meta property="og:image:alt" content={fullTitle} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@studentaitools" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* Global Organization + WebSite Schema (every page) */}
      <script type="application/ld+json">{JSON.stringify(globalSchema)}</script>

      {/* Page-level Structured Data — supports single object OR array */}
      {schema && (
        Array.isArray(schema)
          ? schema.map((s, i) => (
              <script key={i} type="application/ld+json">{JSON.stringify(s)}</script>
            ))
          : <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}

      {/* AdSense Auto Ads */}
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3218995355205467" crossOrigin="anonymous"></script>
    </Helmet>
  );
};

export default SEO;
