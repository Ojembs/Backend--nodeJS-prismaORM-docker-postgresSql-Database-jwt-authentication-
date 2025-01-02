# use an official nodeJs runtime as a parent image
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and the package-lock.json file to the container
COPY package*.json .

# Install the dependencies
RUN npm install

# Copy the rest of the application code 
COPY . .

# Expose the port the app run on
EXPOSE 5000

# Define the command to run your application
CMD [ "node", "./src/server.js" ]