const site = require("./site");
const { metaDescription, absoluteUrl, isoDate } = require("./meta");

function faqPage(faq) {
  return {
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a
      }
    }))
  };
}

function articleJsonLd(data) {
  const slug = data.page && data.page.fileSlug ? data.page.fileSlug : "";
  const urlPath = data.page && data.page.url ? data.page.url : `/blog/${slug}/`;
  const published = isoDate(data.date || (data.page && data.page.date));
  const modified = isoDate(data.updated || data.date || (data.page && data.page.date));
  const article = {
    "@type": "Article",
    headline: data.title,
    description: metaDescription(data.description || ""),
    datePublished: published,
    dateModified: modified,
    author: {
      "@type": "Organization",
      name: site.name,
      url: `${site.url}/`
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: {
        "@type": "ImageObject",
        url: `${site.url}/images/logo.svg`
      }
    },
    mainEntityOfPage: absoluteUrl(urlPath)
  };

  if (data.image) {
    article.image = {
      "@type": "ImageObject",
      url: absoluteUrl(data.image),
      caption: data.imageAlt || ""
    };
  }

  const graph = [article];
  if (Array.isArray(data.faq) && data.faq.length) graph.push(faqPage(data.faq));
  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
}

module.exports = { articleJsonLd, faqPage };
