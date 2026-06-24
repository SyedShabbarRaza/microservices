import express from "express";
import db from "./db/mongo-connection.js";
import User from "./models/userModel.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))  // To access req.body

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
        res.status(201).json(user);
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message });
    }
});

app.listen(3001, () => {
    console.log("User Service is running on port 3001");
});

export default app;
