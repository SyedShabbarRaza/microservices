import express from "express";
import db from "./db/mongo-connection.js";
import User from "./models/userModel.js";
// import amqp from "amqplib"
import { startGrpcServer } from "./grpc/server.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))  // To access req.body

// let channel, connection;
// async function connectRabbitMQ(retries=5,delay=3000) { 
//     while(retries){
//         try {
//         connection = await amqp.connect("amqp://rabbitmq:5672");
//         channel = await connection.createChannel();
//         await channel.assertQueue("user_created", { durable: false });
//         console.log("Connected to RabbitMQ");
//         return;
//     } catch (error) {
//         console.error("Error connecting to RabbitMQ:", error);
//         retries--;
//         console.log(`Retries left: ${retries}`);
//         await new Promise(res => setTimeout(res, delay));
//     }
// }
// }


//Routes
app.get("/getUsers", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message });
    }
});

app.post("/createUser", async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = new User({ name, email });
        await user.save();

        // const message={userId:user._id};
        // if(!channel){
        //     res.send(503).json({error:"RabbitMQ connection not established"})
        // }
        // channel.sendToQueue("user_created", Buffer.from(JSON.stringify(message)));

        res.status(201).json(user);
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message });
    }
});

app.listen(3001, () => {
    console.log("User Service is running on port 3001");
    // connectRabbitMQ();
        startGrpcServer();
});

export default app;
