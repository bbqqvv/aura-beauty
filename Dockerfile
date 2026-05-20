# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Set up build arguments and environment variables for Next.js build-time bundling
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL:-http://localhost:7000}

# Build Next.js application
RUN npm run build

# Expose port
EXPOSE 3000

# Start production server
CMD ["npm", "start"]
