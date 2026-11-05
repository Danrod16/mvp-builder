const { metaDescription, absoluteUrl, isoDate } = require("./lib/meta");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ images: "images" });
  eleventyConfig.addPassthroughCopy({ "learn-ai-bali": "learn-ai-bali" });
  eleventyConfig.addPassthroughCopy({ legal: "legal" });
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy(".nojekyll");
  eleventyConfig.addPassthroughCopy("changes.html");

  eleventyConfig.addFilter("pageTitle", (title, url) => (url === "/" ? title : `${title} | LaunchBrick`));
  eleventyConfig.addFilter("metaDescription", metaDescription);
  eleventyConfig.addFilter("absolute", absoluteUrl);
  eleventyConfig.addFilter("isoDate", isoDate);
  eleventyConfig.addFilter("json", (value) => JSON.stringify(value).replace(/</g, "\\u003c"));
  eleventyConfig.addFilter("xmlEscape", (value) =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
  );

  eleventyConfig.addCollection("posts", (api) =>
    api
      .getFilteredByGlob("src/blog/posts/**/*.md")
      .filter((item) => item.url && !item.data.draft)
      .sort((a, b) => (b.date || 0) - (a.date || 0))
  );

  eleventyConfig.ignores.add("src/blog/POST_TEMPLATE.md");

  eleventyConfig.addTransform("trimXml", (content, outputPath) => {
    if (outputPath && outputPath.endsWith("sitemap.xml")) return `${content.trim()}\n`;
    return content;
  });

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data"
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    pathPrefix: "/"
  };
};
