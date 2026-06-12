import mongoose, { Schema } from "mongoose";

const urlSchema = new Schema({
    shortId: {
        type: String,
        required: true,
        unique: true
    },
    redirectURL: {
        type: String,
        required: true
    },
    visitHistory: [
        { timestamp: Number }
    ],
    userId: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Url = mongoose.models.Url || mongoose.model("Url", urlSchema)

export default Url;
