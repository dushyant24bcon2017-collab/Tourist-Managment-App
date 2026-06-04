import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
//LOGIN API
export const POST= async(req:NextRequest)=>{
try {
    const { email,password} = await req.json()
    if(!email|| !password){
        return NextResponse.json({error:"All details not provided"},{status:400})
    }
    const user = await prisma.user.findUnique({
        where :{email:email}
    })
    if(!user){
        return NextResponse.json({error:"user does not exist"},{status:400})
    }
const validPassword = await bcrypt.compare(password,user.hashpassword)
if(!validPassword){
    return NextResponse.json({error:"incorrect password"},{status:400})
}
const token = jwt.sign(
        {
            userId : user.id,
            name: user.name
        }, process.env.JWT_SECRET as string ,{
            expiresIn: "7d"
        }
       )
       const cookiesStore = await cookies()
       cookiesStore.set({
        name: "auth_token",
    value: token,
    httpOnly: false, 
    secure: process.env.NODE_ENV === "production", 
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, 
    path: "/", 
       })
        return NextResponse.json({user:{
            id:user.id,
            name:user.name,
            email:user.email
        }},{status:200})
} catch (error) {
     return NextResponse.json({error:"Server Error"},{status:500})
}
}