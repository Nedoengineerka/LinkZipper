# LinkZipper
This is a link shortening project written on the NestJS/Prisma(Postgres)/Redis stack, where Postgres was used as the main database and Redis as a cache for requests, and a different uid is generated for each link. The entire project is covered by jest and supertest tests. Also PostgresQL and Redis databases are created with docker-compose.

Only two endpoints are used
- POST /shorten - to shorten the link
- GET /original - to get the original link by passing the shortened one to the body


# Before first start

1) ```sudo docker-compose up -d```
2) After 10-15 seconds (when the database starts in the container)- ```npm run prisma:migrate```

.env values for the example
```
#NODE 
PORT=8000

#DATABASE
POSTGRES_USER=testUser
POSTGRES_PASSWORD=testPassword 
POSTGRES_DB=LinkZipper
POSTGRES_PORT=5432
POSTGRES_HOST=localhost
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"
REDIS_URL=localhost
REDIS_PORT=6379

#HOST
HOST=https://linkzipper.com
```
