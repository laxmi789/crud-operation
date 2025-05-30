import mongoose from "mongoose";

const RegiserSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },   
    email: { type: String, required: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
  },
  { timestamps: true }
);  

export default mongoose.models.Register || mongoose.model("Register", RegiserSchema, "registers");