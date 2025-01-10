import mongoose from 'mongoose'

const mongodbUri = process.env.MONGODB_URI || ''
export const dbConnection= async()=>{
  try {
    if (!mongodbUri) {
      throw new Error('MongoDB URI is not defined')
    }
    await mongoose.connect(mongodbUri)
  } catch (error) {
    console.log(error)
  }
}
