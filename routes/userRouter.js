import express from "express";
import { deleteUser, forgetPassword, getAllUsers, loginUser, registerUser } from '../controller/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.put('/forget-password', forgetPassword);
userRouter.delete('/delete-account/:id', deleteUser);
userRouter.get('/', getAllUsers);

export default userRouter;
