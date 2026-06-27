import mongoose from "mongoose";

const userReferenceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        required: true
    }
});

export default mongoose.model("UserReference", userReferenceSchema);