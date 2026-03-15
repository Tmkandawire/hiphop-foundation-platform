import Message from "../models/Message.js";

/* ----------------------------
   Message Controller
-------------------------------
 */

export const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const newMessage = new Message({
      name,
      email,
      subject,
      message,
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Error creating message:", error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ----------------------------
   Get Messages Controller
------------------------------- */

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
