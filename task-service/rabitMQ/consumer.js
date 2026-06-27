import { getChannel } from "./connection.js";
import userReferenceModel from "../models/userReferenceModel.js";

export function startConsumer() {

    const channel = getChannel();

    channel.consume("user_created", async (message) => {

        if (!message) return;

        try {

            const data = JSON.parse(message.content.toString());

            console.log("Received:", data);

            const exists = await userReferenceModel.findOne({
                userId: data.userId
            });

            if (!exists) {

                await userReferenceModel.create({
                    userId: data.userId
                });

                console.log("User stored:", data.userId);
            }

            channel.ack(message);

        } catch (err) {

            console.log(err);

        }

    });

    console.log("✅ Consumer Started");
}