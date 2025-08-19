# Gunakan base image Node
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json dan package-lock.json dulu (agar caching lebih efisien)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua file project
COPY . .

# Pastikan prisma binary bisa dieksekusi
RUN chmod +x node_modules/.bin/prisma

# Jalankan prisma generate setelah install
RUN npx prisma generate

# Expose port (opsional, misal pakai Express)
EXPOSE 3000

# Start app
CMD ["npm", "run", "start"]
