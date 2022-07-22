# rocketseat-nodejs-rentx

To run the application locally: `yarn dev`

To run in the container: 
- To build the container: `docker build -t rentx .`
- To run the container: `docker run -p 3333:3333 rentx`
- To enter the container: `docker exec -it CONTAINER_ID sh`

To run with docker-compose:
- To run the docker-compose services: `docker-compose up -d`
- To show all containers that is not from k8s: `docker ps | grep -v k8s`
- To see docker logs: `docker logs -f rentx`

Creating Migrations:
- `yarn typeorm migration:create -n CreateCategories`

Running Migrations:
- `yarn typeorm migration:run`