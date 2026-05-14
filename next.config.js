/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i.ibb.co','lh3.googleusercontent.com','res.cloudinary.com', 'images.unsplash.com'],
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/login',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
