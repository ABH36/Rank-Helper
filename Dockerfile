# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests first for better layer caching
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies needed for the build)
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the production bundle
RUN npm run build

# ─── Stage 2: Serve with `serve` ──────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Install the lightweight static file server globally
RUN npm install -g serve

# Copy only the compiled assets from the builder stage
COPY --from=builder /app/dist ./dist

# Expose port 3000 (Easypanel maps this automatically)
EXPOSE 3000

# -s = SPA mode (all routes fall back to index.html for React Router)
# -l 3000 = listen on port 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
