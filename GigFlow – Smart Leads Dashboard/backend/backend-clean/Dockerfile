FROM node:18-alpine

WORKDIR /usr/src/app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production

# Start application
CMD ["npm", "start"]
