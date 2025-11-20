import userModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import validator from "validator";
import bcrypt from "bcrypt";

// CREATE TOKEN
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_TOKEN, { expiresIn: "7d" });
};

// LOGIN USER
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials. Try again." });
        }

        const token = createToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        console.error("Error:", error);
        res.json({ success: false, message: "Error logging in user" });
    }
};

// REGISTER USER
const registerUser = async (req, res) => {
    const { username, password, email } = req.body;

    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists." });
        }

        // VALIDATION
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email." });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            username,
            email,
            password: hashedPassword,
            bankName: "GENERAL",
        });

        const user = await newUser.save();
        const token = createToken(user._id);

        res.json({ success: true, token });
    } catch (error) {
        console.error("Error:", error);
        res.json({ success: false, message: "Error registering user" });
    }
};

// FETCH ALL USERS
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}, "-password"); // exclude password
        res.json({ success: true, users });
    } catch (error) {
        console.error("Error:", error);
        res.json({ success: false, message: "Error fetching users" });
    }
};

// FORGET PASSWORD - SIMPLE RESET
const forgetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (newPassword.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(newPassword, salt);

        user.password = hashed;
        await user.save();

        res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.error("Error:", error);
        res.json({ success: false, message: "Error resetting password" });
    }
};

// DELETE USER
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await userModel.findByIdAndDelete(id);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Error:", error);
        res.json({ success: false, message: "Error deleting user" });
    }
};

export { loginUser, registerUser, getAllUsers, forgetPassword, deleteUser };
