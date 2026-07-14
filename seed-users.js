require("dotenv").config();
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
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

const User = mongoose.models.User || mongoose.model("User", userSchema);

const users = [
  {
    username: "admin.jessica",
    email: "jessica.williams@companydemo.com",
    password: "$2b$10$hashedpasswordhere",
    role: "admin",
    employeeInfo: {
      firstName: "Jessica",
      lastName: "Williams",
      department: "Human Resources",
      position: "HR Manager",
      salary: 95000,
      hireDate: new Date(),
      phone: "555-0101",
    },
    permissions: {
      canEditEmployees: true,
      canDeleteEmployees: true,
      canViewPayroll: true,
    },
    status: "active",
  },
  {
    username: "michael.chen",
    email: "michael.chen@companydemo.com",
    password: "$2b$10$hashedpasswordhere",
    role: "manager",
    employeeInfo: {
      firstName: "Michael",
      lastName: "Chen",
      department: "Engineering",
      position: "Engineering Lead",
      salary: 105000,
      hireDate: new Date(),
      phone: "555-0202",
    },
    permissions: {
      canEditEmployees: true,
      canDeleteEmployees: false,
      canViewPayroll: true,
    },
    status: "active",
  },
  {
    username: "sarah.patel",
    email: "sarah.patel@companydemo.com",
    password: "$2b$10$hashedpasswordhere",
    role: "manager",
    employeeInfo: {
      firstName: "Sarah",
      lastName: "Patel",
      department: "Marketing",
      position: "Marketing Director",
      salary: 98000,
      hireDate: new Date(),
      phone: "555-0303",
    },
    permissions: {
      canEditEmployees: true,
      canDeleteEmployees: false,
      canViewPayroll: true,
    },
    status: "active",
  },
  {
    username: "david.rodriguez",
    email: "david.rodriguez@companydemo.com",
    password: "$2b$10$hashedpasswordhere",
    role: "employee",
    employeeInfo: {
      firstName: "David",
      lastName: "Rodriguez",
      department: "Engineering",
      position: "Software Engineer",
      salary: 85000,
      hireDate: new Date(),
      phone: "555-0404",
    },
    permissions: {
      canEditEmployees: false,
      canDeleteEmployees: false,
      canViewPayroll: false,
    },
    status: "active",
  },
  {
    username: "emma.thompson",
    email: "emma.thompson@companydemo.com",
    password: "$2b$10$hashedpasswordhere",
    role: "employee",
    employeeInfo: {
      firstName: "Emma",
      lastName: "Thompson",
      department: "Design",
      position: "UX Designer",
      salary: 79000,
      hireDate: new Date(),
      phone: "555-0505",
    },
    permissions: {
      canEditEmployees: false,
      canDeleteEmployees: false,
      canViewPayroll: false,
    },
    status: "active",
  },
  {
    username: "alex.kim",
    email: "alex.kim@companydemo.com",
    password: "$2b$10$hashedpasswordhere",
    role: "employee",
    employeeInfo: {
      firstName: "Alex",
      lastName: "Kim",
      department: "Finance",
      position: "Financial Analyst",
      salary: 82000,
      hireDate: new Date(),
      phone: "555-0606",
    },
    permissions: {
      canEditEmployees: false,
      canDeleteEmployees: false,
      canViewPayroll: true,
    },
    status: "active",
  },
  {
    username: "olivia.martinez",
    email: "olivia.martinez@companydemo.com",
    password: "$2b$10$hashedpasswordhere",
    role: "employee",
    employeeInfo: {
      firstName: "Olivia",
      lastName: "Martinez",
      department: "Operations",
      position: "Operations Specialist",
      salary: 78000,
      hireDate: new Date(),
      phone: "555-0707",
    },
    permissions: {
      canEditEmployees: false,
      canDeleteEmployees: false,
      canViewPayroll: false,
    },
    status: "inactive",
  },
  {
    username: "james.wilson",
    email: "james.wilson@companydemo.com",
    password: "$2b$10$hashedpasswordhere",
    role: "employee",
    employeeInfo: {
      firstName: "James",
      lastName: "Wilson",
      department: "IT",
      position: "Systems Administrator",
      salary: 83000,
      hireDate: new Date(),
      phone: "555-0808",
    },
    permissions: {
      canEditEmployees: false,
      canDeleteEmployees: false,
      canViewPayroll: false,
    },
    status: "active",
  },
];

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI is not defined in .env");
    process.exit(1);
  }

  await mongoose.connect(uri, {
    dbName: "employee-management",
  });

  try {
    await User.deleteMany({});
    await User.insertMany(users);
    console.log(`Seeded ${users.length} users.`);
  } catch (error) {
    console.error("Failed to seed users:", error);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
