import express from "express";
import db from "./db/mongo-connection.js";
import Task from "./models/taskModel.js";
// import connectRabbitMQ from "./rabitMQ/services.js"
import { connectRabbitMQ } from "./rabitMQ/connection.js";
import { getChannel } from "./rabitMQ/connection.js";
import { startConsumer } from "./rabitMQ/consumer.js";
import userReferenceModel from "./models/userReferenceModel.js"
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))  // To access req.body

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
        const user = await userReferenceModel.findOne({ userId });

        if (!user) {
        return res.status(404).json({
        error: "User not found"
        });
        }
        console.log("User found in database")
        const task = new Task({ title , userId });
        await task.save();

        const message={taskId:task._id,title, userId};
        let channel = getChannel();
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

app.listen(3002,async () => {
    console.log("Task Service is running on port 3002");
     await connectRabbitMQ();
     startConsumer();
});

export default app;


// {
//   "title": "One More",
//   "userId": "6a3ab2508ef79b2671dd916d"
// }