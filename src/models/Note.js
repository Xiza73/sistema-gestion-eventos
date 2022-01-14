import { Schema, model } from "mongoose";
const { ObjectId } = Schema;

const NoteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "PENDIENTE"
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
    },
    assistance: [{
      type: ObjectId,
      ref: "Assistance",
      required: false,
    }]
  },
  {
    timestamps: true,
  }
);

export default model("Note", NoteSchema);
