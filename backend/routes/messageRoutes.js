const express = require("express");
const Message = require("../models/Message");
const router = express.Router();
const csv = require("csv-parser");
const multer = require("multer");
const fs = require("fs");

// Configure multer for file upload
const upload = multer({ dest: "uploads/" });

// Middleware for socket.io
module.exports = (io) => {
  // Fetch all messages
  router.get("/", async (req, res) => {
    try {
      const messages = await Message.find();
      res.json(messages);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Add multiple messages from CSV (with timestamp)
  router.post("/upload", upload.single("file"), (req, res) => {
    const messages = [];

    // Read the CSV file
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        // Extract data from CSV and push it to the array
        messages.push({
          customerId: row["User ID"], // From the 'User ID' column
          timestamp: new Date(row["Timestamp (UTC)"]), // Convert timestamp to Date
          message: row["Message Body"], // From the 'Message Body' column
        });
      })
      .on("end", async () => {
        try {
          // Insert multiple messages into the database
          const newMessages = await Message.insertMany(messages);
          // Emit an event to notify all clients about the new messages
          io.emit("newMessages", newMessages);
          res.status(201).json(newMessages);
        } catch (err) {
          res.status(400).json({ message: err.message });
        } finally {
          // Delete the file after processing
          fs.unlinkSync(req.file.path);
        }
      });
  });

  // Update a message with agent's answer and close the message
  router.patch("/:id", async (req, res) => {
    try {
      const message = await Message.findById(req.params.id);
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }

      // Prevent editing if the message is already closed
      if (message.status === 'closed') {
        return res.status(400).json({ message: "Message has already been answered." });
      }

      // Update answer and status (to "closed")
      if (req.body.answer) {
        message.answer = req.body.answer;
        message.status = "closed"; // Automatically close the message after answering
      }

      const updatedMessage = await message.save();
      
      // Emit an event to notify all clients about the update
      io.emit('updateMessages', await Message.find());

      res.json(updatedMessage);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  return router; // Return the router to be used in the main server file
};
