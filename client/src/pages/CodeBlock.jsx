import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useContext } from "react";
import { CodeBlockContext } from "../context/CodeBlockContext";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const CodeBlock = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { codeBlockList, code, setCode } = useContext(CodeBlockContext);

  const [currCodeBlock, setCurrCodeBlock] = useState({});
  const [socket, setSocket] = useState(null);
  const [role, setRole] = useState("student");
  const [countUsers, setCountUSers] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    const currBlock = codeBlockList.find((block) => block._id === id);
    setCurrCodeBlock(currBlock);
    setCode(currBlock.template);
  }, []);

  useEffect(() => {
    if (socket) return;
    const newSocket = io(SOCKET_URL, { transports: ["websocket"] });
    setSocket(newSocket);
    return () => {
      if (newSocket.connected) {
        newSocket.disconnect();
      }
      //newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !currCodeBlock) return;
    socket.emit("joinRoom", currCodeBlock.name);

    socket.on("userCount", (count) => {
      setCountUSers(count - 1);
    });

    socket.on("codeUpdate", (newCode) => setCode(newCode));

    //socket.emit("getRole", socket.id, (assignedRole) => setRole(assignedRole));

    socket.on("roleAssigned", (role) => {
      setRole(role);
    });

    socket.on("mentorLeft", () => {
      console.log("Mentor left the room. Returning to lobby.");
      navigate("/");
    });

    return () => {
      //socket.emit("leaveRoom", socket.id);
      socket.off("mentorLeft");
      socket.off("roleAssigned");
      socket.off("codeUpdate");
      socket.off("userCount");
    };
  }, [socket, currCodeBlock]);

  const handleCodeChange = (e) => {
    setCode(e.target.value);
    socket.emit("codeChange", currCodeBlock.name, e.target.value);
    //change the trim to replace without all the whitespaces:
    setIsCorrect(
      e.target.value.replace(/\s/g, "") ===
        currCodeBlock.solution.replace(/\s/g, "")
    );
  };

  return (
    <div>
      <h1>{currCodeBlock?.name}</h1>
      <p>
        Role: {role} | Students in room: {countUsers}
      </p>

      {role === "mentor" ? (
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {code}
        </SyntaxHighlighter>
      ) : (
        <textarea
          value={code}
          onChange={handleCodeChange}
          rows={10}
          cols={50}
        />
      )}

      {isCorrect && <h2>🎉😊 Correct! 😊🎉</h2>}
      <button onClick={() => navigate("/")}>Back to Lobby</button>
    </div>
  );
};

export default CodeBlock;
