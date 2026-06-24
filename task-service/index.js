import express from "express";
import db from "./db/mongo-connection.js";
import Task from "./models/taskModel.js";
// import User from "../user-service/models/userModel.js";
import amqp from "amqplib";
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))  // To access req.body

let channel, connection;

async function connectRabbitMQ(retries=5,delay=3000) {
 
 
    while(retries){
        try {
        connection = await amqp.connect("amqp://rabbitmq:5672");
        channel = await connection.createChannel();
        await channel.assertQueue("task_created", { durable: false });
        console.log("Connected to RabbitMQ");
        return;
    } catch (error) {
        console.error("Error connecting to RabbitMQ:", error);
        retries--;
        console.log(`Retries left: ${retries}`);
        await new Promise(res => setTimeout(res, delay));
    }

}
}

// connectRabbitMQ();


//Routes
app.get("/getTasks", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message });
    }
});

app.post("/createTask", async (req, res) => {
    try {
        const { title, userId } = req.body;
        // const user=User.findById(userId);
        // if(!user){
        //     return res.status(404).json({ error: "User not found" });
        // }else{

        //     const task = new Task({ title , userId });
        //     await task.save();
        //     res.status(201).json(task);
        // }
        const task = new Task({ title , userId });
        await task.save();

        const message={taskId:task._id,title, userId};
        if(!channel){
            res.send(503).json({error:"RabbitMQ connection not established"})
        }
        channel.sendToQueue("task_created", Buffer.from(JSON.stringify(message)));
        res.status(201).json(task);
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message });
    }
});

app.listen(3002, () => {
    console.log("Task Service is running on port 3002");
    connectRabbitMQ();
});

export default app;
