const mongoose = require("mongoose");
const db_uri = process.env.MONGO_URI;
const colors = require("colors");
const connectDB = async () => {
  try {
    // console.log(db_uri);
    const conn = await mongoose.connect(db_uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`mongo db connected : ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

module.exports = connectDB;
