import Head from "next/head";

const SEO = ({ pageTitle, description }) => {
  const defaultTitle = "Aura Beauty - Mỹ phẩm & Làm đẹp cao cấp";
  const title = pageTitle ? `${pageTitle} | Aura Beauty` : defaultTitle;
  const defaultDesc = "Cửa hàng mỹ phẩm chính hãng Aura Beauty. Chuyên cung cấp các dòng sản phẩm dưỡng da, trang điểm và chăm sóc cơ thể cao cấp, mang lại vẻ đẹp tự nhiên và rạng rỡ.";
  const desc = description || defaultDesc;
  const siteUrl = "https://auramp.vercel.app";
  const ogImage = `${siteUrl}/image.png`;

  return (
    <Head>
      <title>{title}</title>
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta name="description" content={desc} />
      <meta name="robots" content="index, follow" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      
      {/* Open Graph / Facebook / Zalo */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:site_name" content="Aura Beauty" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />

      <link rel="icon" href="/favicon.png" />
    </Head>
  );
};

export default SEO;