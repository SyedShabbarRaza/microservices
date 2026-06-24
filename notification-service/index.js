import amqp from "amqplib";
import express from "express";
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))  // To access req.body

let channel, connection;

async function start(){
           try {
            connection = await amqp.connect("amqp://rabbitmq");
            channel = await connection.createChannel();
            await channel.assertQueue("task_created", { durable: false });
            channel.consume("task_created", (message) => {
                if (message) {
                    const data = JSON.parse(message.content.toString());
                    console.log("Notification: NEW Message:", data);
                    channel.ack(message);
                }
            });
            console.log("Connected to RabbitMQ");
            
        } catch (error) {
            console.error("Error connecting to RabbitMQ:", error);
            setTimeout(start, 5000);
        }
}

app.listen(3003, () => {
    console.log("Notification Service is running on port 3003");
    start();
});