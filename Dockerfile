# Gunakan Node.js versi 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Jalankan migrate + seed sebelum start server
CMD npx prisma migrate deploy && npx prisma db seed && npm start
