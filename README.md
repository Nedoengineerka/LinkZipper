# LinkZipper

Before first start

1) ```sudo docker-compose up -d```
2) After 10-15 seconds (when the database starts in the container)- ```npm prisma:migrate```

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
