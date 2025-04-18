 import bcrypt from 'bcryptjs';
 import JWT from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js'
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js';


const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

// Function to validate strong password
const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
};

 export const register = async (req,res)=>{
    const {name, email, password,retypePassword} = req.body;

    if(!name || !email || !password){
        return res.json({success:false, message: 'Missing Details'})
    }

    if (!isValidEmail(email)) {
        return res.json({ success: false, message: 'Invalid email format' });
    }

        // Validate password strength
        if (!isValidPassword(password)) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long, contain one uppercase letter, and one number.' });
        }
    
        // Check if passwords match
        if (password !== retypePassword) {
            return res.status(400).json({ success: false, message: 'Passwords do not match!' });
        }

    try {
        const existingUser = await userModel.findOne({email})

        if(existingUser){
            return res.json({ success:false, message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new userModel({name, email, password: hashedPassword})
        await user.save();

        const token = JWT.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none': 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        //sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to our website',
            text: `Welcome to our website. Your account has been created with email id: ${email}`
        }

        await transporter.sendMail(mailOptions);

        return res.json({success: true});

    } catch (error) {
        res.json({success:false, message: error.message})
    }
 }


 export const login = async (req,res)=>{
    const {email, password} = req.body;

    if(!email || !password){
        return res.json({success: false, message: 'Email and password are required'})
    }

    try {

                // Check if the user is an admin

        const user = await userModel.findOne({email});

        if(!user){
            return res.json({success: false, message:"Invalid email"});
        }
        // change now 3/2025 up to down
        if (email === 'admin@gmail.com' && password === 'Admin123456') {
            const token = JWT.sign({ email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
            // const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({ message: 'Admin login successful', token, role: 'admin' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.json({success: false, message:"Invalid password"});
        }
        const token = JWT.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none': 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        return res.json({success: true, token});



    } catch (error) {
        res.json({success:false, message: error.message})
    }
 }


 export const logout = async (req,res)=>{
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none': 'strict'
        })

        return res.json({success: true, message:"Logged Out"})

    } catch (error) {
        res.json({success:false, message: error.message})
    }
 }

 // Send verification OTP to the USer's Email
 export const sendVerifOtp = async (req,res)=>{
        try {
            const {userId} = req.body;

            const user = await userModel.findById(userId);

            if(user.isAccountVerified){
                return res.json({success:false, message:'Account is Already verified'})
            }

       const otp = String(Math.floor(100000 + Math.random() * 900000));

       user.verifyOtp = otp;
       user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000

       await user.save();

       const mailOption = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject:'Account Verification OTP',
        // text:`Your OTP is ${otp}. Verify your account using this OTP.`,
        html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
       }

       await transporter.sendMail(mailOption);

       res.json({success: true, message: 'Verification OTP Sent on Email'});

        } catch (error) {
            res.json({success:false, message: error.message})
        }
 }

 //Verify the Email using the OTP

 export const verifyEmail = async (req,res)=>{
    const {userId, otp} = req.body;

    if(!userId || !otp){
        return res.json({success: false, message:'Missing Details'});
    }
    try {
        const user = await userModel.findById(userId);

        if(!user){
            return res.json({ success: false, message:'User not found'});
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp){
           return res.json({ success: false, message: 'Invaild OTP'});
        }

        // if(user.verifyOtpExpireAt < Date.now()){
            if(new Date(user.verifyOtpExpireAt) < new Date()){
            return res.json({ success: false, message: 'OTP Expired'});
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt= 0;

        await user.save();
        return res.json({success:'true', message:'Email verified successfully'});


        
    } catch (error) {
        res.json({success:false, message: error.message});
    }
 }

 //Check if user is authenticated

//  export const isAuthenticated = async (req, res)=>{
//     try {
//         return res.json({ success: true});
        
//     } catch (error) {
//         res.json({success:false, message: error.message});
//     }
//  }






// export const isAuthenticated = async (req, res) => {
//     try {
//         const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];

//         if (!token) {
//             return res.status(401).json({ success: false, message: "Unauthorized" });
//         }

//         const decoded = JWT.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;

//         return res.json({ success: true, user: req.user });
//     } catch (error) {
//         res.status(401).json({ success: false, message: "Invalid token" });
//     }
// };



export const isAuthenticated = async (req, res) => {
    try {
      const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];
  
      if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
  
      const decoded = JWT.verify(token, process.env.JWT_SECRET);
  
      const user = await userModel.findById(decoded.id).select("-password");
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      return res.status(200).json({ success: true, user });
    } catch (error) {
      console.error("isAuthenticated error:", error.message);
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
  };
  
  






 // Send Password Reset OTP

 export const sendResetOtp = async(req,res)=>{
    const {email} =req.body;

    if(!email){
        return res.json({success:'false', message:'Email is required'})
    }

    try {

        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false, message:'User not found'});
        }


        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000
 
        await user.save();
 
        const mailOption = {
         from: process.env.SENDER_EMAIL,
         to: user.email,
         subject:'Password Reset OTP',
         text:`Your OTP for reseting your password is ${otp}. Use this OTP to proceed with resetting your password.`,
         html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}", user.email)
        };
        await transporter.sendMail(mailOption);

        return res.json({success:true, message:'OTP sent to your email'});
        
    } catch (error) {
        res.json({success:false, message: error.message});
    }
 }

 // Reset User password

 export const resetpassword = async (req,res)=>{
    const {email, otp, newPassword} = req.body;

    if(!email || !otp || !newPassword){
        return res.json({success:false, message:'Email,OTP, and new password are required'});
    }
    if (!isValidPassword(newPassword)) {
        return res.status(400).json({ success: false, message: "Password must be at least 8 characters long, contain one uppercase letter, and one number." });
    }

    try {

        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false, message:'User Not found'});
        }

        if(user.resetOtp === "" || user.resetOtp !== otp){
            return res.json({success:false, message:'Invalid OTP'});
        }

        if(user.resetOtpExpireAt < Date.now()){
            return res.json({success:false, message:'OTP Expired'});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({success:true, message:'Password has been reset successfully'});
        
    } catch (error) {
        res.json({success:false, message: error.message});
    }
 }



  
  