import { Schema, model } from "mongoose";
const { ObjectId } = Schema;

const AssistanceSchema = new Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Assistance", AssistanceSchema);
