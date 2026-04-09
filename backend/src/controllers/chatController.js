import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";

/**
 *  Tạo conversation
 */
export const createConversation = async (req, res) => {
  try {
    const { userId, email } = req.body;

    //  tìm nếu đã tồn tại theo userId HOẶC email
    let conversation = await Conversation.findOne({
      $or: [
        { userId: userId },
        { email: email }
      ]
    });

    if (!conversation) {
      conversation = await Conversation.create({
        userId,
        email
      });
    } else {
      // Nếu đã tồn tại nhưng thông tin mới (ví dụ thay đổi login device) thì cập nhật
      let isChanged = false;
      if (email && conversation.email !== email) {
        conversation.email = email;
        isChanged = true;
      }
      if (userId && conversation.userId !== userId) {
        conversation.userId = userId;
        isChanged = true;
      }
      if (isChanged) await conversation.save();
    }

    res.json(conversation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/**
 *  Lấy tin nhắn
 */
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.id,
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
};

/**
 *  ADMIN: Lấy danh sách conversation
 */
export const getConversation = async (req, res) => {
  try {
    const data = await Conversation.find()
      .sort({ updatedAt: -1 });

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getConversations = async (req, res) => {
  try {
    const list = await Conversation.find().sort({ updatedAt: -1 });
    
    // Lọc khử trùng lặp theo Email và chỉ lấy phòng có tin nhắn
    const uniqueMap = new Map();
    
    for (const conv of list) {
      if (!conv.email) continue;
      
      // Cái đầu tiên của mỗi email sẽ là cái mới nhất
      if (uniqueMap.has(conv.email)) continue;

      const count = await Message.countDocuments({ conversationId: conv._id });
      if (count > 0) {
        uniqueMap.set(conv.email, conv);
      }
    }

    res.json(Array.from(uniqueMap.values()));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};