import clientPromise from '../../lib/mongodb'
import { registerSchema } from '../../validation/registerSchema'
import bcrypt from 'bcryptjs'
import { ObjectId } from "mongodb"

export default async function handler(req, res) {
  const client = await clientPromise
  const db = client.db()
  const collection = db.collection('registers')

  if (req.method === 'POST') {
    const { id } = req.query
  
    if (!id) {
      // Registration logic
      try {
        const validation = registerSchema.safeParse(req.body)
        if (!validation.success) {
          return res.status(400).json({ errors: validation.error.format() })
        }
  
        const { fullname, email, password, confirmPassword } = req.body
  
        const existingUser = await collection.findOne({ email })
        if (existingUser) {
          return res.status(400).json({ message: "Email already registered" })
        }
  
        const hashedPassword = await bcrypt.hash(password, 10)
  
        const newUser = {
          fullname,
          email,
          password: hashedPassword,
          confirmPassword,
        }
  
        await collection.insertOne(newUser)
        return res.status(201).json({ message: "User registered successfully" })
      } catch (error) {
        console.error("Error registering user:", error)
        return res.status(500).json({ message: "Server error" })
      }
  
    } else {
      // Update logic
      try {
        const result = await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: req.body }
        )
        return res.status(201).json({ message: "Updated successfully" })
      } catch (error) {
        console.error("Error updating user:", error)
        return res.status(500).json({ message: "There is something wrong" })
      }
    }
  }
  else if (req.method === 'GET') {          
      try {
        const userlist = await collection.find({}).toArray()
  
        if (!userlist || userlist.length === 0) {
          return res.status(404).json({ error: 'No users found' })
        }
  
        return res.status(200).json(userlist)

    } catch (error) {
      return res.status(500).json({ error: 'Server error', details: error.message })
    }
  }else if (req.method === 'DELETE') {   
    const { id } = req.query

  if (!id) {
    return res.status(400).json({ message: "Missing user ID" })
  }

  try {
    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    return res.status(200).json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ message: "Server error during deletion" })
  }
  }

  else {
    res.setHeader("Allow", ["POST", "GET", "DELETE"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
