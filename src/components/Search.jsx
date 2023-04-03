import React, { useState, useContext } from "react";
import {
  collection,
  query,
  where,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { database } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [errors, setErrors] = useState(null);

  const handleSearch = async () => {
    try {
      const q = query(
        collection(database, "users"),
        where("displayName", "==", searchTerm)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) =>
        setUsers((prev) => [...prev, { ...doc.data() }])
      );
    } catch (error) {
      setErrors(error.message);
      console.log(error.message);
    }
  };
  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };
  const handleSelect = async (user) => {
    const combinedId =
      currentUser?.uid > user?.uid
        ? currentUser?.uid + user?.uid
        : user?.uid + currentUser?.uid;
    try {
      //check weather the group(chats in firestore) exists, if not create new one
      const response = await getDoc(doc(database, "chats", combinedId));
      if (!response.exists()) {
        await setDoc(doc(database, "chats", combinedId), { messages: [] });
        await updateDoc(doc(database, "userChats", currentUser?.uid), {
          [combinedId + ".userInfo"]: {
            uid: user?.uid,
            displayName: user?.displayName,
            photoURL: user?.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
        await updateDoc(doc(database, "userChats", user?.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser?.uid,
            displayName: currentUser?.displayName,
            photoURL: currentUser?.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {}
    setUsers([]);
    setSearchTerm("");
  };
  return (
    <div className="w-100 border-b border-gray-700 ">
      <input
        type="text"
        placeholder="Search by username..."
        className="px-2 placeholder:text-xs py-1 text-xsw-100 border-b border-gray-200 m-0 w-full focus-visible:outline-none"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKey}
      />
      {users?.map((user, index) => {
        return (
          <div
            className="receiver p-2 border-b border-gray-300 flex items-center cursor-pointer"
            key={index}
            onClick={() => handleSelect(user)}
          >
            <div className="receiver-img-container h-8 w-8 mr-2">
              <img
                src={user?.photoURL}
                alt="receiver"
                className="h-full w-full object-cover rounded-full"
              />
            </div>
            <div className="info text-xs">
              <p>{user?.displayName}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Search;
