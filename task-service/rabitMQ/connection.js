import amqp from "amqplib";

let connection;
let channel;

export async function connectRabbitMQ(retries = 5, delay = 3000) {

    while (retries) {

        try {

            connection = await amqp.connect("amqp://rabbitmq:5672");

            channel = await connection.createChannel();

            // Queues used by this service
            await channel.assertQueue("user_created", {
                durable: false,
            });

            await channel.assertQueue("task_created", {
                durable: false,
            });

            console.log("✅ RabbitMQ Connected");

            return channel;

        } catch (err) {

            console.log(err);

            retries--;

            console.log(`Retries Left: ${retries}`);

            await new Promise(res => setTimeout(res, delay));
        }
    }

    throw new Error("RabbitMQ connection failed.");
}

export function getChannel() {

    if (!channel) {
        throw new Error("RabbitMQ channel not initialized.");
    }

    return channel;
}