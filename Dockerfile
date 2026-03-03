# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Add wget for Coolify healthcheck (nginx:alpine has neither curl nor wget by default)
RUN apk add --no-cache wget

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Healthcheck so Coolify (and Docker) can verify the container is serving
HEALTHCHECK --interval=10s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:80/ > /dev/null || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
