import mongoose from "mongoose";

const connectDB = async() => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI, {
            autoIndex: true,
        })

    console.log(`MongoDB Connected: ${connect.connection.host}`); 
    }
    catch (error) {
        console.error(`Mongodb Connection Failed: ${error.message}`);
          process.exit(1);   
    }
    }

export default connectDB;