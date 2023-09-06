# LinkZipper
# Part 1
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

# Part 2
Before thinking about the architecture, you need to understand the amount of memory and queries being processed. If we take the maximum of 100,000 requests per second, it will be 100,000 * 3600 seconds * 24 hours * 30 days = 259.2 billion requests per month. Or, with the average size of one record in the database for this service (2 KB), 518.4 TB. This is a huge amount of memory, so it makes no sense to keep a link for a month. With such a huge number of requests, you can make the lifetime of the link equal to 1 hour, after which the maximum memory usage will be 360 GB, and the lifetime will not be too short.

A single node will not be able to handle this many requests, so you need to run the application on several servers that are connected together by a load balancer, which can work, for example, on the 'round robin' principle, which is possible under ideal conditions when all nodes process requests in the same time and the load balancer then distributes requests evenly. But even distribution is impossible with such a large number of requests, so the load balancer needs to keep track of which node has the lowest load and pass the request to it.

At the same time, the issue of the uniqueness of the created links remains, which can only be realized by using a third-party service from which each node will take a unique value to generate a link. In my application, I used uuid, but ideally, it should be a separate server with an application for such synchronization between nodes, which, for example, will keep a counter of requests to it and transmit as a unique value the number of requests.
