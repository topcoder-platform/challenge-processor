# Use the base image with Node.js
FROM node:10.16

# Copy the current directory into the Docker image
COPY . /challenge-processor

# Set working directory for future use
WORKDIR /challenge-processor

# Install the dependencies from package.json
RUN git config --global url."https://git@".insteadOf git://
RUN npm install
CMD npm start
