import mongoose from "mongoose";

const conectDb = async()=>{
    try {
        const conect = await mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDb conected: ${conect.connection.host}`);
    } catch (error) {
        console.error(`Error:${error.message}`)
        process.exit(1);
    }

}

export default conectDb