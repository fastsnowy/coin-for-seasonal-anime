/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_DEPLOY_URL || 'https://coin-for-seasonal-anime.vercel.app',
    generateRobotsTxt: true, // (optional)
    sitemapSize: 7000,
    // ...other options
}