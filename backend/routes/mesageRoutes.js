const express = require("express");
const {
  sendMessage,
  fetchMessages,
} = require("../controllers/messageControllers");
const protect = require("../middlewares/protect");
const router = express.Router();

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, fetchMessages);

module.exports = router;
