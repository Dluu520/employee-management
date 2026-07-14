import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "manager", "employee"],
      default: "employee",
    },
    employeeInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      department: { type: String, default: "" },
      position: { type: String, default: "" },
      salary: { type: Number, default: 0 },
      hireDate: { type: Date, default: Date.now },
      phone: { type: String, default: "" },
    },
    permissions: {
      canEditEmployees: { type: Boolean, default: false },
      canDeleteEmployees: { type: Boolean, default: false },
      canViewPayroll: { type: Boolean, default: false },
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;
