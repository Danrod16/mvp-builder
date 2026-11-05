const site = require("../../lib/site");
const faq = require("./faq");
const { faqPage } = require("../../lib/article");

const orgId = `${site.url}/#organization`;

module.exports = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": orgId,
      name: site.name,
      url: `${site.url}/`,
      email: site.email,
      logo: `${site.url}/images/logo.svg`,
      description: site.description,
      sameAs: site.sameAs,
      founder: {
        "@type": "Person",
        name: "Daniel Rodriguez"
      }
    },
    {
      "@type": "Service",
      "@id": `${site.url}/#service`,
      name: "AI agent setup for small businesses",
      serviceType: "AI consulting",
      description:
        "We find repetitive work and build AI agents that do it inside accounts you own. The price is fixed and agreed before any work starts.",
      provider: { "@id": orgId },
      areaServed: "Worldwide",
      url: `${site.url}/`
    },
    {
      "@type": "FAQPage",
      "@id": `${site.url}/#faq`,
      ...(() => {
        const page = faqPage(faq);
        return { mainEntity: page.mainEntity };
      })()
    }
  ]
};
