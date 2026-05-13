import mongoose from "mongoose";

// Connect to the MongoDB database
const connectDB = async () => {

    mongoose.connection.on('connected', () => console.log('Database Connected'))

    await mongoose.connect(`${process.env.MONGODB_URI}/lms`)

}

export default connectDB

// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     mongoose.connection.on("connected", () => {
//       console.log("Database Connected");
//       console.log("Connected DB name:", mongoose.connection.name);
//     });

//     await mongoose.connect(process.env.MONGODB_URI);
//   } catch (error) {
//     console.error("MongoDB connection error:", error.message);
//     process.exit(1);
//   }
// };

// export default connectDB;