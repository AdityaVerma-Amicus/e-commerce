type StructuredData = Record<string, unknown>;

interface SEOProps {
  title: string;
  description: string;
  canonicalPath: string;
  noIndex?: boolean;
  structuredData?: StructuredData | StructuredData[];
}

const SITE_URL = "https://e-commerce-orpin-pi-23.vercel.app";

function SEO({
  title,
  description,
  canonicalPath,
  noIndex = false,
  structuredData,
}: SEOProps) {
  const normalizedPath = canonicalPath.startsWith("/")
    ? canonicalPath
    : `/${canonicalPath}`;

  const canonicalUrl = `${SITE_URL}${normalizedPath}`;

  const pageSchemas = structuredData
    ? Array.isArray(structuredData)
      ? structuredData
      : [structuredData]
    : [];

  const schemas: StructuredData[] = [
    {
      "@type": "Organization",
      name: "E-Commerce",
      url: SITE_URL,
    },
    {
      "@type": "WebSite",
      name: "E-Commerce",
      url: SITE_URL,
    },
    ...pageSchemas,
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": schemas,
  };

  // Prevent a literal "<" in serialized data from ending the script element.
  const serializedJsonLd = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  return (
    <>
      <title>{title}</title>

      <meta name="description" content={description} />

      <link rel="canonical" href={canonicalUrl} />

      <meta
        name="robots"
        content={noIndex ? "noindex, nofollow" : "index, follow"}
      />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="E-Commerce" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializedJsonLd }}
      />
    </>
  );
}

export default SEO;
