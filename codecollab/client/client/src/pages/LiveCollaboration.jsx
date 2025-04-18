import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import MonacoEditor from "@monaco-editor/react";
import { useParams, useNavigate } from "react-router-dom";

const socket = io("http://localhost:4000");

const LiveCollaboration = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
  const [roomTitle, setRoomTitle] = useState(localStorage.getItem("roomTitle") || "Live Collaboration");
  const [code, setCode] = useState("// Start coding...");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);
  const [typing, setTyping] = useState(null);

  useEffect(() => {
    if (!roomId || !userName) {
      navigate("/live");
      return;
    }

    socket.emit("joinRoom", { roomId, userName }, (error, initialCode) => {
      if (error) {
        alert(error);
        navigate("/live");
      } else {
        setCode(initialCode);
      }
    });

    socket.on("codeUpdate", (newCode) => setCode(newCode));
    socket.on("receiveMessage", (msg) => setMessages((prev) => [...prev, msg]));
    socket.on("updateUserList", (users) => setActiveUsers(users));
    socket.on("userTyping", (user) => setTyping(user));
    socket.on("userStoppedTyping", () => setTyping(null));

    return () => {
      socket.emit("leaveRoom", roomId);
      socket.off("codeUpdate");
      socket.off("receiveMessage");
      socket.off("updateUserList");
      socket.off("userTyping");
      socket.off("userStoppedTyping");
    };
  }, [roomId, userName, navigate]);

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (e.target.value.trim()) {
      socket.emit("userTyping", userName);
    } else {
      socket.emit("userStoppedTyping");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Navbar with Room Title */}
      <nav className="bg-gray-800 p-4 text-center text-lg font-semibold">{roomTitle}</nav>
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-1/4 bg-gray-800 p-4 flex flex-col">
          <h2 className="text-sm font-semibold mb-2">Connected Users</h2>
          <div className="flex-1 overflow-y-auto">
            {activeUsers.map((user, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-gray-700 rounded-lg mb-2">
                <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-xs font-bold">
                  {user.charAt(0).toUpperCase()}
                </div>
                <p className="text-sm">{user}</p>
              </div>
            ))}
          </div>
          <button className="mt-4 bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-600" onClick={() => navigator.clipboard.writeText(roomId)}>
            Copy Room ID
          </button>
          <button className="mt-2 bg-red-600 px-4 py-2 rounded-md hover:bg-red-500" onClick={() => navigate("/live")}>
            Exit Room
          </button>
        </aside>

        {/* Main Editor Area */}
        <main className="flex-1 flex flex-col p-4">
          <div className="flex-1 border border-gray-700 rounded-lg overflow-hidden">
            <MonacoEditor
              height="100%"
              language="javascript"
              value={code}
              theme="vs-dark"
              onChange={(newCode) => {
                setCode(newCode);
                socket.emit("codeChange", { roomId, code: newCode });
              }}
            />
          </div>
        </main>

        {/* Chat Section */}
        <aside className="w-1/4 bg-gray-800 p-4 flex flex-col">
          <h2 className="text-sm font-semibold mb-2">Chat</h2>
          <div className="flex-1 overflow-y-auto border border-gray-700 p-2 rounded-lg bg-gray-900">
            {messages.map((msg, index) => (
              <p key={index} className="text-sm">
                <span className="font-semibold text-blue-400">{msg.userName}: </span>
                {msg.message}
              </p>
            ))}
            {typing && <p className="text-xs text-gray-400">{typing} is typing...</p>}
          </div>
          <div className="mt-2 flex">
            <input
              type="text"
              className="flex-1 p-2 border border-gray-700 rounded-l-lg bg-gray-700 text-white focus:outline-none"
              placeholder="Type a message..."
              value={message}
              onChange={handleTyping}
            />
            <button
              className="bg-green-500 px-4 py-2 rounded-r-lg hover:bg-green-600"
              onClick={() => {
                if (message.trim()) {
                  socket.emit("sendMessage", { roomId, message, userName });
                  setMessage("");
                  socket.emit("userStoppedTyping");
                }
              }}
            >
              Send
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default LiveCollaboration;
