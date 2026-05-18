FROM node:18-alpine

WORKDIR /usr/src/app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build Vite application
RUN npm run build

# Expose port
EXPOSE 3000

# Start server using Vite preview (hosts on port 3000)
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "3000"]
