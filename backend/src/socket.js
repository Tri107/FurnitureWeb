import { Server } from 'socket.io';
import Message from "./models/messageModel.js";
import Conversation from "./models/conversationModel.js";

let io;

export const setupSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173', 'http://localhost:5174'], 
      credentials: true
    },
    maxHttpBufferSize: 1e7 // Tăng payload socket lên 10MB để gửi ảnh 
  });

  //  Xử lý kết nối realtime
  io.on("connection", (socket) => {
    socket.on("join_room", (room) => {
      socket.join(room);
    });

    socket.on("join_admin_room", () => {
      socket.join("admin_room");
    });

    socket.on("send_message", async (data) => {
      try {
        //  LƯU DB
        const newMsg = await Message.create(data);
        io.to(data.conversationId.toString()).emit("receive_message", newMsg);

        // Nếu người gửi không phải admin đánh dấu chưa đọc
        if (data.senderId !== "admin") {
          await Conversation.findByIdAndUpdate(data.conversationId, { hasAdminRead: false, updatedAt: new Date() });
          io.to("admin_room").emit("admin_new_message", data.conversationId);
        }
      } catch (err) {
        console.error("Lỗi socket send_message:", err);
      }
    });

    socket.on("mark_as_read", async (conversationId) => {
      try {
        if (conversationId) {
          await Conversation.findByIdAndUpdate(conversationId, { hasAdminRead: true });
        }
      } catch (err) {
        console.error("Lỗi socket mark_as_read:", err);
      }
    });

    socket.on("recall_message", async (data) => {
      try {
        const updatedMsg = await Message.findByIdAndUpdate(
          data.messageId, 
          { isRecalled: true, content: "", image: "" },
          { new: true }
        );
        if (updatedMsg) {
          io.to(data.conversationId.toString()).emit("message_recalled", data.messageId);
        }
      } catch (error) {
        console.error("Lỗi socket recall_message:", error);
      }
    });

    socket.on("disconnect", () => {
    });
  });

  return io;
};

export { io };
