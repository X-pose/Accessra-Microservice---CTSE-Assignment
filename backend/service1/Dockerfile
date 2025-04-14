FROM node:18

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the service files
COPY . .

EXPOSE 5000

CMD ["npm", "start"]
