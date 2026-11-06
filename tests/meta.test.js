const assert = require("assert");
const fs = require("fs");
const { metaDescription } = require("../lib/meta");
const { articleJsonLd } = require("../lib/article");
const site = require("../lib/site");

assert.equal(metaDescription("already short"), "already short");
assert.ok(site.description.length <= 155);
assert.equal(metaDescription(site.description), site.description);

const clean = "alpha beta gamma delta ".repeat(12).trim();
const cut = metaDescription(clean, 155);
assert.ok(cut.length <= 155, cut.length);
assert.ok(cut.length > 0);
assert.equal(clean.slice(cut.length, cut.length + 1), " ");
assert.equal(clean.startsWith(cut), true);
assert.equal(cut.endsWith(" "), false);

const article = articleJsonLd({
  title: "Example",
  description: `${"word ".repeat(50)}end`,
  date: "2026-11-05",
  page: { fileSlug: "example", url: "/blog/example/" },
  image: "/images/og.png",
  imageAlt: "Whiteboard sketch with no people.",
  faq: [{ q: "Is this a sample?", a: "Yes. It is not a published post." }]
});
const types = article["@graph"].map((node) => node["@type"]);
assert.deepEqual(types, ["Article", "FAQPage"]);
assert.ok(article["@graph"][0].description.length <= 155);
assert.equal(article["@graph"][0].image.caption, "Whiteboard sketch with no people.");
assert.equal(article["@graph"][0].mainEntityOfPage, "https://launchbrick.com/blog/example/");

const template = fs.readFileSync("src/blog/POST_TEMPLATE.md", "utf8");
const description = template.match(/description: (.+)/)[1];
assert.ok(description.length <= 155, description);
assert.match(template, /imageAlt:/);
assert.match(template, /draft: true/);
assert.match(template, /^## /m);
assert.match(template, /^### /m);
assert.match(template, /faq:/);

console.log("meta tests passed");
