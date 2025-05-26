'use client'
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"


export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const [user, setUser] = useState(false) 
  const [delpop, setDelPop] = useState(false)

  async function Edit(id) {
    const selectedUser = userData.find(u => u._id === id)

    if (selectedUser) {
      setUser(selectedUser)
      setShowPopup(true)
    }
       
  }

  async function Update(id){    
    try{
  const response = await fetch(`/api/submit?id=${id}`, {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fullname: user.fullname }),
  })
  
  if(response.ok){    
    toast.success("updated successfully")
    setShowPopup(false)
  }  
}catch(error){
    console.log('Error')
     toast.error(error) 
  }   
  } 
  
  async function Delete(id) {
   
    if (window.confirm("Are you sure you want to proceed?")) {
    try {
      const response = await fetch(`/api/submit?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        toast.success("Deleted successfully");
        location.reload();
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to delete");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Something went wrong");
    //}
  }
  }
}

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
   if(status === 'authenticated' && session?.user?.id){
  const fetchData = async () => {
    const response = await fetch('api/submit')
    const res = await response.json()   
    setUserData(res)
    }
    fetchData()
  }
  }, [status, session?.user?.id])   
  
  return (
    <>
    <div className="text-right m-4">        
  <button onClick={() => signOut()} type="submit" className="px-2 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-700">Sign Out</button>
    </div> 
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">Fullname</th>
            <th scope="col" className="px-6 py-3">Email</th>
            <th scope="col" className="px-6 py-3">Update</th>
            <th scope="col" className="px-6 py-3">Delete</th>      
          </tr>
        </thead>
        <tbody>
        {userData && userData.length > 0 ? (
    userData.map((userD, index) => (
            <tr key={userD._id || index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 text-white"><td className="px-6 py-4">{userD.fullname}</td><td className="px-6 py-4">{userD.email}</td><td className="px-6 py-4" onClick={() => Edit(userD._id)}><svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"/>
        </svg></td><td className="px-6 py-4" onClick={() => Delete(userD._id)}><svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h11m0 0-4-4m4 4-4 4m-5 3H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h3"/>
</svg></td></tr>
    ))
         ) : (
          <tr className="bg-white dark:bg-gray-800 text-center text-white">
            <td colSpan="4" className="px-6 py-4">No user data found</td>
          </tr>
        )}          
        </tbody>
      </table>  

      {showPopup && user && (
  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded shadow-md text-black w-96 relative">
      <h2 className="text-xl font-bold mb-4">User Details</h2>
      <div>
      <lable className="block mb-2 mt-2 text-sm font-medium text-gray-600">Full Name</lable>
       <input type='text' value={user.fullname} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" onChange={(e) => setUser({ ...user, fullname: e.target.value })} />
       </div>
       <div>
       <lable className="block mb-2 mt-2 text-sm font-medium text-gray-600">Email</lable>
       <input type='text' value={user.email} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
       </div>
       <div className="flex justify-between">
       
      <button
        onClick={() => setShowPopup(false)}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
        Close
      </button>
      
      <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded text-right align-right hover:bg-indigo-700" onClick={() => Update(user._id)}>
        Update
      </button>
      
      </div>
    </div>
  </div>
)} 
    </>
  )
}
