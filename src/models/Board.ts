import { Schema, model, models } from "mongoose";

const BoardSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },

    name: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, trim: true, maxlength: 500 },
    category: { type: String, required: true, trim: true, maxlength: 50 },

    collaborators: [{ type: String, default: [] }],
    isSecret: { type: Boolean, default: false },
    hasMap: { type: Boolean, default: false },
  },
  { timestamps: true }
);

BoardSchema.index({ userId: 1, name: 1 });

export const Board = models.Board || model("Board", BoardSchema);
