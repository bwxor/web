# Use an official Node runtime as a base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app/frontend

# Copy package.json and package-lock.json to the container
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY frontend/. .

# Build the frontend app
RUN npm run build

# Use the official NGINX image for production
FROM nginx:stable-alpine as production

WORKDIR /usr/src/app

# copy nginx configuration in side conf.d folder
COPY --from=build /usr/src/app/nginx /etc/nginx/conf.d

# Copy the build output from the dist folder into the Nginx html directory
COPY --from=build /usr/src/app/frontend/dist /usr/share/nginx/html

# Expose port 80 to allow access to the app
EXPOSE 80

# Run Nginx in the foreground
ENTRYPOINT ["nginx", "-g", "daemon off;"]