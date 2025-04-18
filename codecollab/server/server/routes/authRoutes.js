import express from 'express'
import { isAuthenticated, login, logout, register, resetpassword, sendResetOtp, sendVerifOtp, verifyEmail} from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth, sendVerifOtp);
authRouter.post('/verify-account', userAuth, verifyEmail);
authRouter.get('/is-auth', userAuth, isAuthenticated);
authRouter.post('/send-reset-otp',  sendResetOtp);
authRouter.post('/reset-password',  resetpassword);

export default authRouter;