const withNextra = require('nextra').default({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx'
})

const isStaticExport =
  process.env.STATIC_EXPORT === 'true' ||
  process.env.NEXT_OUTPUT === 'export'

/** @type {import('next').NextConfig} */
const nextConfig = isStaticExport
  ? {
      output: 'export',
      trailingSlash: true,
      images: { unoptimized: true }
    }
  : {}

module.exports = withNextra(nextConfig)
