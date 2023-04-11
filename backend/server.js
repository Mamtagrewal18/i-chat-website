const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/mesageRoutes");
const app = express();
dotenv.config();

app.use(express.json()); //app can handle json data
const connectDB = require("./config/db.js");
connectDB();
const PORT = process.env.PORT || 5000;

var cors = require("cors");
app.use(cors()); // Use this after the variable declaration

app.listen(PORT, () => {
  console.log(`server is working at https//localhost:${PORT} `);
});

//homepage
app.get("/", (req, res) => {
  res.status(200).send("HI this is homepage");
});
app.use("/api/user", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
