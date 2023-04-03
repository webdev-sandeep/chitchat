import React, { useRef, useEffect, useContext, useState } from "react";
import ReceiverMessage from "./ReceiverMessage";
import SenderMessage from "./SenderMessage";
import { ChatContext } from "../context/ChatContext";
import { timeSince } from "../utils/constants";
import {
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { database, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { AuthContext } from "../context/AuthContext";

const ChatBox = () => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  const handleSend = async () => {
    await updateDoc(doc(database, "chats", data?.chatId), {
      messages: arrayUnion({
        id: uuid(),
        message: text,
        senderId: currentUser?.uid,
        date: Date.now(),
      }),
    });

    await updateDoc(doc(database, "userChats", currentUser?.uid), {
      [data?.chatId + ".lastMessage"]: { message: text },
      [data?.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(database, "userChats", data?.user?.uid), {
      [data?.chatId + ".lastMessage"]: { message: text },
      [data?.chatId + ".date"]: serverTimestamp(),
    });

    setImage(null);
    setText("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchChat = () => {
      const unsub = onSnapshot(doc(database, "chats", data?.chatId), (doc) => {
        doc.exists() && setMessages(doc?.data()?.messages);
      });
      return () => {
        unsub();
      };
    };
    if (data.chatId) {
      fetchChat();
    }
  }, [data?.chatId]);
  return (
    <>
      <div className="chat-header flex border-b border-gray-700 px-2 items-center h-14 bg-white rounded-se">
        <div className="ms-2 me-8 capitalize">{data?.user?.displayName}</div>
        {error && <p className="text-xs text-red-500 ml-4">{error}</p>}
      </div>
      <div className="chat-body h-[397px] overflow-auto">
        {messages?.map((message) => {
          if (message.senderId === currentUser.uid) {
            return (
              <SenderMessage
                message={message?.message}
                time={timeSince(message?.date)}
                avatar={currentUser?.photoURL}
                key={message?.id}
              />
            );
          }
          return (
            <ReceiverMessage
              message={message?.message}
              time={timeSince(message?.date)}
              avatar={data?.user?.photoURL}
              key={message?.id}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="chatbox flex border-b border-gray-700 px-2 items-center h-12 bg-white rounded-ee">
        <input
          type="text"
          className="w-11/12 focus-visible:outline-none placeholder:text-sm text-sm"
          placeholder="Type Something Here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <div
          className="w-1/12 cursor-pointer bg-primaryGreen text-center rounded text-white text-sm py-1"
          onClick={handleSend}
        >
          Send
        </div>
      </div>
    </>
  );
};

export default ChatBox;
