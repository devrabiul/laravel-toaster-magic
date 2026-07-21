import { Helmet } from "react-helmet-async";

const SITE_URL = "https://devrabiul.github.io/laravel-toaster-magic";

interface SeoProps {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}

/** Per-page metadata: title, description, keywords, canonical, Open Graph, and
 *  Twitter Card tags. Every page renders one so each URL is uniquely indexable. */
export function Seo({ title, description, path, keywords }: SeoProps) {
  const canonical = `${SITE_URL}${path === "/" ? "/" : path}`;
  const fullTitle = path === "/" ? title : `${title} · Laravel Toaster Magic`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(", ")} />
      )}
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={`${SITE_URL}/og-image.svg`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${SITE_URL}/og-image.svg`} />
    </Helmet>
  );
}
