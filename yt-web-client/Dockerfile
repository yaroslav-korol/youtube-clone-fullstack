# BUILD STAGE
FROM node:20 AS builder

# Set the working directory
WORKDIR /app

# Copy package*.json files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy other source code files
COPY . .

# Build the app
RUN npm run build




# PRODUCTION STAGE
FROM node:20-slim AS production

# Set the working directory
WORKDIR /app

# Copy config files
COPY .env package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built app from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Define the command to run your app using CMD which defines your runtime
EXPOSE 3000

# Run the app
CMD ["npm", "start"]

# Add metadata to the image
LABEL   maintainer="Yaroslav Korol <yaroslav.v.korol@gmail.com>" \
        version="1.0" \
        description="Dockerfile for yt-web-client"
