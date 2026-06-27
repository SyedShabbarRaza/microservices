import { getChannel } from "./connection.js";

export function publishTaskCreated(task) {

    const channel = getChannel();

    const message = {
        taskId: task._id,
        title: task.title,
        userId: task.userId,
    };

    channel.sendToQueue(
        "task_created",
        Buffer.from(JSON.stringify(message))
    );

    console.log("Task Published");
}