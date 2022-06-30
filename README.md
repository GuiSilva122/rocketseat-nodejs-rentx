# rocketseat-nodejs-rentx

To run the application: yarn dev

To run in the container: 
- To build the container: docker build -t rentx .
- To run the container: docker run -p 3333:3333 rentx
- To enter the container: docker exec -it CONTAINER_ID sh

Creating Migrations:
- yarn typeorm migration:create -n CreateCategories

Running Migrations:
- yarn typeorm migration:run