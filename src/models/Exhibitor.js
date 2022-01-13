import { Schema, model } from "mongoose";

const ExhibitorSchema = new Schema(
  {
    dni: {
      type: Number,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Exhibitor", ExhibitorSchema);
