const assert = require("assert");
const fs = require("fs");
const path = require("path");
const nunjucks = require("nunjucks");
const faq = require("../src/_data/faq");
const testimonials = require("../src/_data/testimonials");
const site = require("../lib/site");
const { metaDescription, absoluteUrl, isoDate } = require("../lib/meta");

function read(rel) {
  return fs.readFileSync(path.join("dist", rel), "utf8");
}

function decode(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function meta(html, name) {
  const match = html.match(new RegExp(`<meta name="${name}" content="([^"]*)">`));
  assert.ok(match, name);
  return decode(match[1]);
}

const home = read("index.html");
const h1s = home.match(/<h1[\s>]/g) || [];
assert.equal(h1s.length, 1);
assert.match(home, /<h1>Hand off the busywork\. Keep the business\.<\/h1>/);
assert.equal(meta(home, "description"), site.description);
assert.ok(meta(home, "description").length <= 155);
assert.match(home, /<link rel="canonical" href="https:\/\/launchbrick\.com\/">/);
assert.match(home, /property="og:title"/);
assert.match(home, /property="og:image"/);
assert.match(home, /Skip to content/);
assert.match(home, /id="main"/);
assert.match(home, /aria-label="Primary"/);
assert.match(home, /<footer/);

const jsonBlocks = [...home.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) =>
  JSON.parse(match[1])
);
assert.equal(jsonBlocks.length, 1);
const graphTypes = jsonBlocks[0]["@graph"].map((node) => node["@type"]);
assert.deepEqual(graphTypes, ["Organization", "Service", "FAQPage"]);
assert.equal(jsonBlocks[0]["@graph"][1].offers, undefined);
const faqLd = jsonBlocks[0]["@graph"][2].mainEntity;
assert.equal(faqLd.length, faq.length);
faq.forEach((item, index) => {
  assert.equal(faqLd[index].name, item.q);
  assert.equal(faqLd[index].acceptedAnswer.text, item.a);
});

const visibleFaq = [...home.matchAll(/<details class="faq">\s*<summary><h3>([\s\S]*?)<\/h3><\/summary>\s*<p>([\s\S]*?)<\/p>\s*<\/details>/g)];
assert.equal(visibleFaq.length, faq.length);
visibleFaq.forEach((match, index) => {
  assert.equal(decode(match[1]), faq[index].q);
  assert.equal(decode(match[2]), faq[index].a);
});

const quotes = [...home.matchAll(/<blockquote><p>([\s\S]*?)<\/p><\/blockquote>/g)].map((match) => decode(match[1]));
assert.deepEqual(quotes, testimonials.map((person) => person.quote));
assert.match(home, /Hady Hobeich/);
assert.match(home, /buylive\.app/);
assert.match(home, /Cristina/);
assert.match(home, /labtestonline\.com/);
assert.match(home, /Adriana Romero/);
assert.match(home, /Equinox Urban Housing/);
assert.doesNotMatch(home, /images\/(?:hady|dani|hero-entrepreneur|cristina|adriana|carlota|cohort)/);

assert.equal((home.match(/Price on call/g) || []).length, 3);
assert.doesNotMatch(home, /\$\s?\d/);
assert.doesNotMatch(home, /Most popular/i);
assert.match(home, /package=starter/);
assert.match(home, /package=team/);
assert.match(home, /package=custom/);
assert.ok((home.match(/\[DRAFT: pending Daniel review\]/g) || []).length >= 4);
assert.match(home, /Result numbers stay blank/);
assert.match(home, /project timeline stays blank/i);

for (const file of [
  "index.html",
  "blog/index.html",
  "work/kaori-media/index.html",
  "ai-automation-for-small-business/index.html",
  "ai-agents-explained/index.html",
  "css/site.css",
  "js/site.js"
]) {
  const text = read(file);
  assert.doesNotMatch(text, /whatsapp|wa\.me|30-min|30-minute|cal\.com\/PLACEHOLDER/i, file);
  assert.doesNotMatch(text, /cal\.com\/launchbrick\/30min/, file);
}

assert.match(home, /https:\/\/cal\.com\/launchbrick\/15min/);
assert.match(home, /Book a 15-min call/);
assert.match(home, /A 15-minute call/);
assert.match(home, /mailto:daniel@launchbrick\.com/);
const sketches = [
  "hero.png",
  "how-it-works.png",
  "package-starter.png",
  "package-team.png",
  "package-custom.png",
  "proof-agent-org-chart.png",
  "final-cta-calendar.png",
  "problem-inbox.png",
  "problem-supplier-sourcing.png",
  "problem-finance-prep.png",
  "problem-crm-upkeep.png",
  "problem-content.png",
  "problem-reports.png"
];
for (const name of sketches) {
  assert.ok(home.includes(`/assets/illustrations/${name}`), name);
  assert.ok(fs.existsSync(`dist/assets/illustrations/${name}`), name);
  assert.ok(fs.existsSync(`assets/illustrations/${name}`), name);
}
const sketchTags = [...home.matchAll(/<img\b[^>]*class="sketch[^"]*"[^>]*>/g)].map((match) => match[0]);
assert.equal(sketchTags.length, 13);
assert.equal(sketchTags.filter((tag) => tag.includes('alt=""')).length, 12);
assert.ok(sketchTags.some((tag) => tag.includes("Sketch of one orchestrator node fanning out to many agent nodes.")));

const blog = read("blog/index.html");
assert.match(blog, /<h1>Blog<\/h1>/);
assert.match(blog, /No posts yet/);
assert.doesNotMatch(blog, /name="robots" content="noindex/);
assert.match(blog, /ai-automation-for-small-business/);
assert.match(blog, /ai-agents-explained/);
assert.ok(meta(blog, "description").length <= 155);

for (const stub of [
  "work/kaori-media/index.html",
  "ai-automation-for-small-business/index.html",
  "ai-agents-explained/index.html"
]) {
  assert.match(read(stub), /noindex, follow/);
  assert.equal((read(stub).match(/<h1[\s>]/g) || []).length, 1);
  assert.ok(meta(read(stub), "description").length <= 155);
}
assert.match(read("work/kaori-media/index.html"), /\[DRAFT: pending Daniel review\]/);
assert.doesNotMatch(read("work/kaori-media/index.html"), /\d+\s*%|\$\d|\b\d+\s+hours\b/i);

const sitemap = read("sitemap.xml");
assert.match(sitemap, /^<\?xml/);
for (const loc of [
  "https://launchbrick.com/",
  "https://launchbrick.com/blog/",
  "https://launchbrick.com/learn-ai-bali/",
  "https://launchbrick.com/legal/privacy.html",
  "https://launchbrick.com/legal/terms.html",
  "https://launchbrick.com/legal/refund.html"
]) {
  assert.ok(sitemap.includes(`<loc>${loc}</loc>`), loc);
}
assert.doesNotMatch(sitemap, /kaori|ai-automation-for-small-business|ai-agents-explained|404/);
assert.equal((sitemap.match(/<loc>/g) || []).length, 6);

assert.match(read("learn-ai-bali/index.html"), /Learn AI in Bali/);
assert.equal(fs.readFileSync("CNAME", "utf8").trim(), "launchbrick.com");
assert.equal(fs.readFileSync("dist/CNAME", "utf8").trim(), "launchbrick.com");
assert.equal(fs.existsSync("robots.txt"), false);
assert.equal(fs.existsSync("dist/robots.txt"), false);
assert.match(read("404.html"), /Page not found/);

for (const rel of ["index.html", "404.html", "sitemap.xml", "css/site.css", "js/site.js", "blog/index.html"]) {
  assert.equal(fs.readFileSync(rel, "utf8"), fs.readFileSync(path.join("dist", rel), "utf8"), rel);
}

const imgs = home.match(/<img\b[^>]*>/g) || [];
assert.ok(imgs.length >= 1);
for (const img of imgs) assert.match(img, /\balt="/);

const env = nunjucks.configure("src/_includes", { autoescape: true });
env.addFilter("isoDate", isoDate);
env.addFilter("absolute", absoluteUrl);
env.addFilter("metaDescription", metaDescription);
env.addFilter("json", (value) => JSON.stringify(value));
const rendered = env.render("post.njk", {
  title: "Inbox example",
  description: "A description under the limit.",
  date: "2026-11-05",
  image: "/images/og.png",
  imageAlt: "Whiteboard sketch of sorted trays. No people.",
  content: "<h2>Section</h2><h3>Detail</h3><p>Body copy.</p>",
  faq: [{ q: "Will it send mail?", a: "Only after you approve the draft." }],
  site
});
assert.equal((rendered.match(/<h1[\s>]/g) || []).length, 1);
assert.match(rendered, /alt="Whiteboard sketch of sorted trays\. No people\."/);
assert.match(rendered, /<h2>Section<\/h2>/);
assert.match(rendered, /<h3>Detail<\/h3>/);
assert.match(rendered, /<h2 id="post-faq-title">Questions<\/h2>/);
assert.match(rendered, /Will it send mail\?/);
assert.match(rendered, /Book a 15-min call/);
assert.match(rendered, new RegExp(site.cal.replace(/[.]/g, "\\.")));
assert.match(rendered, /email us/);

console.log("site tests passed");
