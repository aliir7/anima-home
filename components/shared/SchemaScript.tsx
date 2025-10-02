"use client";

import openGraphImg from "@/public/opengraph-image.png";

function SchemaScript() {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "آنیماهوم",
      url: "https://anima-home.ir",
      logo: `${openGraphImg.src}`,
      sameAs: [
        "https://telegram.me/AnimaHomeDecor",
        "https://wa.me/989129277302",
        "https://www.instagram.com/anima.home.ir?igsh=YTB4eHhmdG82bnpn",
        "https://www.youtube.com/@Anima-HomeOfficial",
        "https://www.aparat.com/animahome.ir/",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+98-912-927-7302",
        contactType: "customer service",
        areaServed: "IR",
        availableLanguage: "Persian",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "شهرک صنعتی چهاردانگه خیابان بیست و چهارم",
        addressLocality: "تهران",
        addressCountry: "IR",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "درباره ما - آنیما هوم",
      url: "https://anima-home.ir/about",
    },
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "تماس با - آنیما هوم",
      url: "https://anima-home.ir/contact",
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "پروژه‌های آنیما هوم",
      url: "https://anima-home.ir/projects",
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "متریال‌های آنیما هوم",
      url: "https://anima-home.ir/materials",
    },
  ];

  return (
    <script
      id="schema-anima-home"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default SchemaScript;
