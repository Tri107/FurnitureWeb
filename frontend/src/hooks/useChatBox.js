import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import { createOrGetConversation, getChatMessages } from "../lib/api";

export default function useChatBox() {
  const location = useLocation();
  const socketRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [messageToRecall, setMessageToRecall] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [conversationId, setConversationId] = useState(null);

  // LẤY USER TỪ LOCALSTORAGE
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // TỰ ĐỘNG CUỘN XUỐNG
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // TẠO SOCKET VÀ EVENT LISTENER
  useEffect(() => {
    const socket = io("http://localhost:9999", {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("receive_message", (data) => {
      setMessages(prev => {
        const exists = prev.some(msg => msg._id === data._id);
        if (exists) return prev;
        return [...prev, data];
      });
    });

    socket.on("message_recalled", (messageId) => {
      setMessages(prev => prev.map(msg => 
        msg._id === messageId ? { ...msg, isRecalled: true } : msg
      ));
    });

    return () => {
      socket.off("receive_message");
      socket.off("message_recalled");
      socket.disconnect();
    };
  }, []);

  // TẠO / LẤY CONVERSATION
  useEffect(() => {
    if (!user) return;

    createOrGetConversation({
      userId: user.id || user._id,
      email: user.email,
    })
      .then(data => {
        setConversationId(data._id);
        socketRef.current.emit("join_room", data._id);
        return getChatMessages(data._id);
      })
      .then(data => setMessages(data))
      .catch(err => console.error("Lỗi khi tải chat:", err));
  }, [user?.id, user?._id, user?.email]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const cancelImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sendMessage = () => {
    if ((!input.trim() && !image) || !user || !conversationId) return;

    const msg = {
      conversationId,
      senderId: user.id || user._id,
      email: user.email,
      content: input.trim(),
      image: image,
    };

    socketRef.current.emit("send_message", msg);
    setInput("");
    cancelImage();
  };

  const handleRecall = () => {
    if (messageToRecall) {
      socketRef.current.emit("recall_message", {
        messageId: messageToRecall,
        conversationId,
      });
      setMessageToRecall(null);
    }
  };

  return {
    isOpen, setIsOpen,
    messages, setMessages,
    input, setInput,
    image, imagePreview,
    handleImageChange, cancelImage,
    sendMessage,
    messageToRecall, setMessageToRecall, handleRecall,
    fileInputRef, messagesEndRef,
    user, location
  };
}
