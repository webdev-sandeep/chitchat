import React, { useState, useEffect, useContext } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { database } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Friends = () => {
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const handleSelect = (payload) => {
    dispatch({ type: "CHANGE_USER", payload });
  };

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(
        doc(database, "userChats", currentUser?.uid),
        (doc) => {
          setChats(doc.data());
        }
      );
      return () => {
        unsub();
      };
    };
    currentUser?.uid && getChats();
  }, [currentUser?.uid]);

  return (
    <>
      {chats &&
        Object?.entries(chats)
          ?.sort((a, b) => b[1].date - a[1].date)
          ?.map((chat) => {
            return (
              <div
                className="receiver p-2 border-b border-gray-300 flex items-center cursor-pointer"
                key={chat[0]}
                onClick={() => handleSelect(chat[1]?.userInfo)}
              >
                <div className="receiver-img-container h-8 w-8 mr-2">
                  <img
                    src={chat[1]?.userInfo?.photoURL}
                    alt="receiver"
                    className="h-full w-full object-cover rounded-full"
                  />
                </div>
                <div className="info text-sm">
                  <p>{chat[1]?.userInfo?.displayName}</p>
                  <p className="text-xs">{chat[1]?.lastMessage?.message}</p>
                </div>
              </div>
            );
          })}
    </>
  );
};

export default Friends;
