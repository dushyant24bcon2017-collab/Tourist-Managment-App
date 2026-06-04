import { NextResponse,NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import  jwt  from "jsonwebtoken";
import { cookies } from "next/headers";
//SIGNUP API
export const  POST = async(req:NextRequest )=>{
    try {
        const {name, email,password}= await req.json()
        if(!name||!email||!password){
            return NextResponse.json({error:"All details not provided"},{status:400})
        }
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: "Email is already registered!" }, { status: 400 });
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const user = await prisma.user.create({
            data:{
                name:name,
                email:email,
                hashpassword:hashedPassword
            }
        })
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

