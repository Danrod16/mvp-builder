function metaDescription(input, max = 155) {
  const clean = String(input ?? "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const window = clean.slice(0, max);
  const boundary = window.lastIndexOf(" ");
  if (boundary <= 0) return window.trim();
  return window.slice(0, boundary).trim();
}

function absoluteUrl(path) {
  const value = String(path || "/");
  if (/^https?:\/\//.test(value)) return value;
  const site = require("./site");
  return site.url + (value.startsWith("/") ? value : `/${value}`);
}

function isoDate(value) {
  if (!value) return "";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10);
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

module.exports = { metaDescription, absoluteUrl, isoDate };
