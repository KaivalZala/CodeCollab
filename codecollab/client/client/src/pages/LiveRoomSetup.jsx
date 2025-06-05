import React, { useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/Usernavbar";

const socket = io("https://codecollab-backend-q353.onrender.com");

const LiveRoomSetup = () => {
  const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [roomTitle, setRoomTitle] = useState("");
  const [isCreating, setIsCreating] = useState(true);
  const navigate = useNavigate();

  const createRoom = () => {
    if (!userName.trim()) {
      alert("Please enter your name before creating a room.");
      return;
    }
    if (!roomTitle.trim()) {
      alert("Please enter a title for the room.");
      return;
    }

    socket.emit("createRoom", userName, (id) => {
      localStorage.setItem("userName", userName);
      localStorage.setItem("roomTitle", roomTitle);
      navigate(`/live/${id}`);
    });
  };

  const joinRoom = () => {
    if (!userName.trim() || !roomId.trim()) {
      alert("Please enter your name and a valid Room ID.");
      return;
    }
    localStorage.setItem("userName", userName);
    navigate(`/live/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex flex-col">
      <UserNavbar />

      <div className="flex flex-col items-center justify-center flex-1 px-6">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-gray-900 border border-gray-300">
          <div className="flex justify-center mb-4">
            <button 
              className={`w-1/2 py-2 text-lg font-semibold border-b-2 ${isCreating ? 'border-blue-500 text-blue-500' : 'border-gray-300 text-gray-500'}`} 
              onClick={() => setIsCreating(true)}
            >
              Create Room
            </button>
            <button 
              className={`w-1/2 py-2 text-lg font-semibold border-b-2 ${!isCreating ? 'border-green-500 text-green-500' : 'border-gray-300 text-gray-500'}`} 
              onClick={() => setIsCreating(false)}
            >
              Join Room
            </button>
          </div>

          {isCreating ? (
            <>
              <input
                type="text"
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <input
                type="text"
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter Room Title"
                value={roomTitle}
                onChange={(e) => setRoomTitle(e.target.value)}
              />
              <button
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
                onClick={createRoom}
              >
                Create Room
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <input
                type="text"
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
              <button
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition"
                onClick={joinRoom}
              >
                Join Room
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveRoomSetup;
