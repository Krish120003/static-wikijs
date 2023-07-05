/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.CF_PAGES_URL || "http://localhost:3000",
  generateRobotsTxt: true, // (optional)
  outDir: "out/",
  // ...other options
};
