# Use official Playwright image with browser dependencies preinstalled
FROM mcr.microsoft.com/playwright:v1.44.0-jammy

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Install Playwright browsers and system deps
RUN npx playwright install --with-deps

# Copy the rest of your code
COPY . .

# Expose the port your Express app listens on (e.g., 3000)
EXPOSE 3000

# Run your script (change this if your entry point differs)
CMD ["node", "index.js"]
