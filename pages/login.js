   // 'use client'
import { getCsrfToken, signIn } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import '../src/app/globals.css'
import { useSession, signOut } from "next-auth/react"

export default function LoginPage({ csrfToken }) {
   const { data: session, status } = useSession()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter();


  useEffect(() => { 
     if(status === 'authenticated' && session?.user?.id){
      router.push("/dashboard")
     }
    })

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Login
          </h2> 
    <form method="post" onSubmit={handleSubmit} className="space-y-4">
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />    

             <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">
                Email Address
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter your email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                required />
                
            </div>      
      <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">
                Password
              </label>
              <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter your password" value={password}
        onChange={(e) => setPassword(e.target.value)}
        required/>             
            </div>
            <button type="submit" className="w-full px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-700">
              Login
            </button>
    </form>
    </div>
            </div>
  )
}

LoginPage.getInitialProps = async (context) => {
  return {
    csrfToken: await getCsrfToken(context),
  };
};
