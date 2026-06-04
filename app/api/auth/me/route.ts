import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
//ME API 
interface tokenpayload{
    userId : string
}
export const GET = async(req:NextRequest)=>{
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("auth_token")?.value
        if(!token){
            return NextResponse.json({error:"No token present, Authorization Failed"},{status:400})
        }
        const decoded = jwt.verify(token , process.env.JWT_SECRET as string) as tokenpayload

        const user = await prisma.user.findUnique({
            where:{id:decoded.userId},
            select:{
                id:true,
                name:true,
                email:true
            }
        })
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 400 });
        }
        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "server error" }, { status: 500 });
    }
}