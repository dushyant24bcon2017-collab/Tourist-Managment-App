"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Login() {
const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const router = useRouter()
const submitHandler = async(e: React.FormEvent)=>{
e.preventDefault()
try {
    const data = await fetch("/api/auth/login",{
       method:"POST",
       headers:{"Content-Type": "application/json"},
       body: JSON.stringify({email,password})
    })
    const res = await data.json()
    if(!data.ok){
        alert("Login Failed!")
        return 
    }
   router.push("/");
} catch (error) {
    
}
}
  return (
    <div className="flex justify-center items-center h-screen"> 
    <Card className="w-full max-w-sm ">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
            <Link href={"/signup"}> 
          <Button variant="link" >Sign Up</Button>
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={submitHandler}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label  htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email} 
                onChange={(e)=> setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
               
              </div>
              <Input id="password" type="password" required value={password} onChange={(e)=> setPassword(e.target.value)}/>
            </div>
          </div>
          <CardFooter className="flex-col gap-2">
        <Button  type="submit" className="w-full">
          Login
        </Button>
        
      </CardFooter>
        </form>
      </CardContent>
      
    </Card>
    </div>
  )
}
