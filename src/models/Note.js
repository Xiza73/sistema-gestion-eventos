import { Schema, model } from "mongoose";
const { ObjectId } = Schema;

const NoteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    exhibitors: [{
      type: ObjectId,
      ref: "Exhibitor",
      required: false,
    }],
    date: {
      type: String,
      required: true,
    },
    schedule: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export default model("Note", NoteSchema);
