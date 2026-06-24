add .env file to both user-service and task-service where you will add just 

#MONGODB_URI="mongodb://mongo:27017/tasks" 
and 
MONGODB_URI="mongodb://mongo:27017/users"
respectively.

Then you can run docker compose up 
all the other things will be managed through docker.

Then go to http://localhost:15672/
to get the queues data
but before that make an api call to

http://localhost:3002/createTask
with
data something like this: {
  "title": "One More",
  "userId": "6a3ab2508ef79b2671dd916d"
}
