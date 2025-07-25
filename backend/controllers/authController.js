const User=require('../models/User')
const jwt=require("jsonwebtoken");

//generate JWT token
const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET, {expiresIn: "1h"});

};
//Controller functions
//Register User
exports.registerUser=async(req,res)=>{
    const {fullName,email,password,profileImageUrl}=req.body;

    //checking for missing fields
    if(!fullName ||!email ||!password){
        return res.status(400).json({message: "All fields are required"});
    }
    try{
        //checking if email aready exists
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"Email already in use"});
        }
        //create user
        const user=await User.create({
            fullName,
            email,
            password,
            profileImageUrl,
        });
        res.status(201).json({
            id:user._id,
            user,
            token:generateToken(user._id),
        });

    }catch(err){
        res
        .status(500)
        .json({message:"Error registering user",error:err.message});
    }
};

//Login User
exports.loginUser=async(req,res)=>{
    const {email,password}= req.body;

if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
}

try {
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
        id: user._id,
        user,
        token: generateToken(user._id),
    });
} catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
}
};
//Register User
exports.getUserInfo=async(req,res)=>{
    try{
        const user=await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json(user);
    }catch(err){
        res.status(500).json({message:"Error fetching user info",error:err.message});
    }
};