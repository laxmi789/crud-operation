'use client'

import React, { useState } from 'react'
import { toast } from "react-toastify"


export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [uniqueEmail, setUniqueEmail] = useState(null)
  const [fnErr, setFnErr] = useState(null)
  const [eErr, setEerr] = useState(null)
  const [passErr, setPassErr] = useState(null)
  const [error, setError] = useState(null)
  const [confirmPassword, setconfirmPassword] = useState(null)

  async function onSubmit(event) {
    event.preventDefault()    
    setIsLoading(true)
    setUniqueEmail(null) // Clear previous errors when a new request starts
    setFnErr(null)
    setEerr(null)
    setPassErr(null)   
 
  try {   
    const formData = new FormData(event.target)
    const dataa = Object.fromEntries(formData.entries())
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataa),
    })
     
    if(response.ok){            
      toast.success("Registered successfully!")
      event.target.reset()
      setFnErr(null)
      setEerr(null)
      setPassErr(null)
      setUniqueEmail(null)
      setconfirmPassword(null)
    }
  
    // Handle response if necessary
    const data = await response.json()   
    
    const fnError = data.errors?.fullname?._errors[0] || ""
    const eError = data.errors?.email?._errors[0] || ""
    const passError = data.errors?.password?._errors[0] || ""
    const errUniqueEmail = data?.error || ""
     const errconfirmPassword = data.errors?.confirmPassword?._errors[0] || ""
    
    
    fnError?setFnErr(fnError):""
    eError?setEerr(eError):""
    passError?setPassErr(passError):""
    errUniqueEmail?setUniqueEmail(errUniqueEmail):""
    errconfirmPassword?setconfirmPassword(errconfirmPassword):"" 

  } catch (error) {      
    setError(error.message)
    toast.error(error)   
  } finally {
    setIsLoading(false)
  }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Register
        </h2> 
             
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your name" name="fullname"/>
              {fnErr && <div style={{ color: 'red' }}>{fnErr}</div>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Email Address
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter your email" name="email"/>
              {eErr && <div style={{ color: 'red' }}>{eErr}</div>}
              {uniqueEmail && <div style={{ color: 'red' }}>{uniqueEmail}</div>} 
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Password
            </label>
            <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter your password" name="password"/>
            {passErr && <div style={{ color: 'red' }}>{passErr}</div>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Confirm Password
            </label>
            <input type="password" name="confirmPassword" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Confirm your password" />
            {confirmPassword && <div style={{ color: 'red' }}>{confirmPassword}</div>}
          </div>
          
          <div>
            <button type="submit" className="w-full px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-700" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}