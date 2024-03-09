/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.philippines-hoho.ph',
                port: '',
            },
        ],
    },
}

module.exports = nextConfig
