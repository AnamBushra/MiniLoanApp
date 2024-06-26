const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();
const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User Schema
const UserSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    phone: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    loans: [{ type: mongoose.Schema.Types.ObjectId, ref: "Loan" }],
  },
  { timestamps: true }
);

// Loan Schema
const loanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    alternatePhone: { type: String, required: true },
    amount: { type: Number, required: true },
    term: { type: Number, required: true },
    repayments: [
      {
        date: { type: Date, required: true },
        amount: { type: Number, required: true },
        status: {
          type: String,
          default: "PENDING",
          enum: ["PENDING", "PAID", "FAILED"],
        },
      },
    ],
    status: {
      type: String,
      default: "PENDING",
      enum: ["PENDING", "PAID", "REJECTED"],
    },
  },
  { timestamps: true }
);

// Admin User Schema
const AdminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", AdminSchema);
const Loan = mongoose.model("Loan", loanSchema);
const User = mongoose.model("User", UserSchema);

// Middleware
app.use(cors());
app.use(express.json());

// Register Endpoint
app.post("/api/register", async (req, res) => {
  const { firstName, lastName, phone, email, password } = req.body;

  if (!firstName || !lastName || !phone || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      firstName,
      lastName,
      phone,
      email,
      password: hashedPassword,
    });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Login Endpoint
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User Does Not Exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Passwords Don't Match" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.send({ message: "success", token: token, userId: user._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Admin Login Endpoint
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const isMatch = password === admin.password;
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Loan Application Endpoint
app.post("/api/loans", async (req, res) => {
  const {
    userId,
    alternatePhone,
    loanAmount,
    loanPurpose,
    loanTerm,
    repayments,
  } = req.body;

  if (
    !userId ||
    !alternatePhone ||
    !loanAmount ||
    !loanPurpose ||
    !loanTerm ||
    !repayments
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const loan = new Loan({
      user: user._id,
      alternatePhone,
      amount: loanAmount,
      term: loanTerm,
      repayments,
      status: "PENDING",
    });
    await loan.save();
    await User.updateOne({ _id: userId }, { $addToSet: { loans: loan._id } });

    res.status(201).json({ message: "Loan application submitted", loan });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get Loans by User ID Endpoint
app.get("/api/loans/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const loans = await Loan.find({ user: userId }).populate("user");
    if (!loans) {
      return res.status(404).json({ message: "No loans found for this user" });
    }

    res.json({ loans });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
// Make a repayment
app.post("/api/loans/:loanId/repay", async (req, res) => {
  try {
    const { loanId } = req.params;
    const { repaymentId, amount } = req.body;

    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    const repayment = loan.repayments.id(repaymentId);
    if (!repayment) {
      return res.status(404).json({ message: "Repayment not found" });
    }

    if (repayment.status === "PAID") {
      return res.status(400).json({ message: "Repayment already completed" });
    }

    if (amount < repayment.amount) {
      return res
        .status(400)
        .json({ message: "Repayment amount is less than required" });
    }

    repayment.status = "PAID";
    await loan.save();
    const updateResult = await updateLoanStatus(loanId);

    if (!updateResult.success) {
      return res.status(500).json({ message: updateResult.message });
    }

    res.json({ message: "Repayment successful", loan: updateResult.loan });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Approve Loan Endpoint
app.post("/api/loans/:loanId/approve", async (req, res) => {
  try {
    const { loanId } = req.params;

    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    loan.repayments.forEach((repayment) => {
      repayment.status = "PAID";
    });

    loan.status = "PAID";
    await loan.save();

    res.json({ message: "Loan approved successfully", loan });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get All Loans Endpoint
app.get("/api/allloans", async (req, res) => {
  try {
    const loans = await Loan.find().populate("user");
    res.json({ loans });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

const updateLoanStatus = async (loanId) => {
  try {
    const loan = await Loan.findById(loanId);

    if (!loan) {
      return { success: false, message: "Loan not found" };
    }

    const allRepaymentsPaid = loan.repayments.every(
      (repayment) => repayment.status === "PAID"
    );

    if (allRepaymentsPaid) {
      loan.status = "PAID";
      await loan.save();
    }

    return { success: true, loan };
  } catch (err) {
    console.error(err.message);
    return { success: false, message: "Server error" };
  }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
