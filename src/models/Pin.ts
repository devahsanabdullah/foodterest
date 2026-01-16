import mongoose, { Schema, models, model } from "mongoose";

const PinSchema = new Schema(
    {
        userId: { type: String, required: true },

        image: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        board: { type: String, required: true },
        tags: [{ type: String }],
    },
    { timestamps: true }
);

export const Pin = models.Pin || model("Pin", PinSchema);
