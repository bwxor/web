# Installation

#### Clone (or update) the repository locally:
```
git clone https://github.com/bwxor/web
```

## Frontend

#### `cd` into the frontend folder:
```
cd frontend
```

#### Run `docker build` to create a new image from the `Dockerfile`:
```
sudo docker build -t frontend .
```

#### Start the container based on the built image (as Nginx server):
```
docker run -d -p 80:80 frontend
```

`80` is the machine listening port, getting mapped to the vite server that runs locally on port `5173`.

## Backend

#### `cd` into the backend folder:
```
cd backend
```

Create a `.env` file with the following structure:
```
MONGODB_URI=mongodb+srv://mario:<PASSWORD>@bwxor.0vtzgzz.mongodb.net
MONGODB_NAME=bwxor
JWT_SECRET_KEY=<KEY>
```

Of course, the `<PASSWORD>` field needs to be replaced with the actual database password, while `<KEY>` needs to be a secure BASE64 encoded string. 

#### Run `docker build` to create a new image from the `Dockerfile`:
```
sudo docker build -t backend .
```
#### Start the container based on the built image:
```
docker run -d -p 5000:8080 backend
```

`5000` is the machine listening port, getting mapped to the Spring Boot (Tomcat) server that runs locally on port `8080`.

# Maintenance

Running Docker processes can be viewed by using:
```
docker ps
```
including `-a` also displays the recently stopped processes.

```
docker logs <containerId>
```
will show what went wrong with the startup of your container. `containerId` is to be found in the previous command.

If there is no more space left on the `/var` partition, all container-related files can be removed via:
```
docker system prune --all --force
```
