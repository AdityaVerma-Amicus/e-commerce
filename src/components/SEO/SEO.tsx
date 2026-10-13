
interface SEOProps {
  title: string;
  description: string;
  canonicalPath: string;
  noIndex?: boolean;
}

const SITE_URL = "https://e-commerce-orpin-pi-23.vercel.app";

function SEO({
  title,
  description,
  canonicalPath,
  noIndex = false,
}: SEOProps) {
  const normalizedPath = canonicalPath.startsWith("/")
    ? canonicalPath
    : `/${canonicalPath}`;

  const canonicalUrl = `${SITE_URL}${normalizedPath}`;

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
    </>
  );
}

export default SEO;
