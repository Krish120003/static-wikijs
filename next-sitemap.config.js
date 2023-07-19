/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl:
    (process.env.NODE_ENV === "production" && process.env.DEPLOYMENT_URL) ||
    "http://localhost:3000",
  generateRobotsTxt: true, // (optional)
  // ...other options
};
