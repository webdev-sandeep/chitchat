import React, { useRef, useEffect, useState, useContext } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import Search from "../components/Search";
import Friends from "../components/Friends";
import ChatBox from "../components/ChatBox";
import profile from "../assets/avatar.png";

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [error, setError] = useState(null);

  const handleSignout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div className="bg-gray-900 min-h-screen grid place-items-center">
      <div className="w-[1000px]">
        {error && <p className="text-xs text-red-500 text-center">{error}</p>}
        <div className="app-container bg-white rounded flex h-[500px]">
          <div className="timeline-container w-72 rounded-s">
            <div className="timeline-header flex border-b border-gray-700 px-2 items-center h-14 border-e justify-between">
              <div className="font-rampart ms-2 me-2 text-xl capitalize">
                chitchat
              </div>
              <div className="user-info flex items-center">
                <div className="image-container h-5 w-5 ms-2">
                  <img
                    src={currentUser?.photoURL || profile}
                    alt="profile"
                    className="h-full w-full object-cover rounded-full"
                  />
                </div>
                <p className="mx-2 text-sm">
                  {currentUser?.displayName || "User"}
                </p>
                <button
                  className="text-xs rounded text-white bg-gray-700 px-3 py-1"
                  onClick={handleSignout}
                >
                  logout
                </button>
              </div>
            </div>
            <div className="timeline-body h-[444px] overflow-auto">
              <Search />
              <Friends />
            </div>
          </div>
          <div className="chat-container flex-1 bg-primaryGreen rounded-e">
            <ChatBox />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
