const { metaDescription } = require("../../../lib/meta");
const { articleJsonLd } = require("../../../lib/article");

module.exports = {
  layout: "post.njk",
  ogType: "article",
  tags: ["post"],
  eleventyComputed: {
    description(data) {
      return metaDescription(data.description || "");
    },
    permalink(data) {
      if (data.draft) return false;
      return `/blog/${data.page.fileSlug}/`;
    },
    articleJson(data) {
      if (data.draft) return null;
      if (data.image && !String(data.imageAlt || "").trim()) {
        throw new Error(`Blog post "${data.title || data.page.inputPath}" is missing imageAlt.`);
      }
      if (!String(data.description || "").trim()) {
        throw new Error(`Blog post "${data.title || data.page.inputPath}" is missing a description.`);
      }
      return articleJsonLd(data);
    }
  }
};
