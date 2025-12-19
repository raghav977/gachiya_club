import Admin from "../models/AdminModal.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const LoginAdmin = async(req,res)=>{
    try{
        // console.log("Login Admin Request Body:", req.body);
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"Email and Password are required"});
        }


        const admin=await Admin.findOne({where:{email}});
        console.log("Found Admin:", admin);
        if(!admin){
            return res.status(404).json({message:"Admin not found"});
        }


        const isMatch=await bcrypt.compare(password,admin.password);
        // console.log("Password match status:", isMatch);
        if(!isMatch){
            return res.status(401).json({message:"Invalid credentials"});
        }

        const token=jwt.sign(
            {id:admin.id,email:admin.email,role:'admin'},
            process.env.JWT_SECRET,
            {expiresIn:'2h'}
        );
        // console.log("Generated JWT Token for Admin:", token);

        return res.status(200).json({
            message:"Admin logged in successfully",
            token,
            admin:{
                id:admin.id,
                email:admin.email,
                name:admin.name
            }
        });

    }
    catch(err){

        console.error("Error in LoginAdmin:", err?.message || err);
        // if jwt secret missing, provide helpful message
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "JWT secret not configured on server (process.env.JWT_SECRET missing)" });
        }

        return res.status(500).json({ message: err.message || "Internal Server Error" });

    }
}

export const registerAdmin = async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"Name, Email and Password are required"});
        }

        const existingAdmin=await Admin.findOne({where:{email}});
        if(existingAdmin){
            return res.status(409).json({message:"Admin with this email already exists"});
        }

        const hashedPassword=await bcrypt.hash(password,10);

        const newAdmin=await Admin.create({
            email,
            password:hashedPassword
        });

        return res.status(201).json({
            message:"Admin registered successfully",
            admin:{
                id:newAdmin.id,
                name:newAdmin.name,
                email:newAdmin.email
            }
        });

    }
    catch(err){
        console.error("Error registering admin:", err.message);
        return res.status(500).json({message:"Internal Server Error"});
    }
}


export const verifyAdminToken = async (req, res) => {
    try {
        const auth = req.headers.authorization || req.headers.Authorization;
        if (!auth) return res.status(401).json({ message: "Authorization header required" });

        const token = auth.startsWith("Bearer ") ? auth.split(" ")[1] : auth;
        if (!token) return res.status(401).json({ message: "Token not provided" });

        if (!process.env.JWT_SECRET) return res.status(500).json({ message: "JWT secret not configured on server" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({ message: "Token valid", data: decoded });
    } catch (err) {
        console.error("Token verification error:", err.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}