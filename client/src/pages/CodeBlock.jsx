import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useContext } from "react";
import { CodeBlockContext } from "../context/CodeBlockContext";

const CodeBlock = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { codeBlockList, code, setCode } = useContext(CodeBlockContext);
  const socketUrl = io(import.meta.env.VITE_SOCKET_URL);
  
  const [currCodeBlock, setCurrCodeBlock] = useState({});
  const [socket, setSocket] = useState(null);

  const [role, setRole] = useState("student"); // ברירת מחדל - סטודנט
  const [countUsers, setCountUSers] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    const currBlock = codeBlockList.find((block) => block._id === id);
    setCurrCodeBlock(currBlock);
    setCode(currBlock.template);
  }, []);

  let newSocket;
  
  useEffect(() => {
    if (socket !== null) return;
    newSocket = io(socketUrl);
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !currCodeBlock) return;
    // התחברות ל-Socket
    socket.emit("joinRoom", currCodeBlock.name);
    
    socket.on("userCount", (count) => {
      //console.log("Users in room:", count);
      setCountUSers(count-1);
    });

    // קבלת עדכון קוד מ-Socket
    socket.on("codeUpdate", (newCode) => setCode(newCode));

    // זיהוי התפקיד (הראשון שנכנס הוא מנטור)
    socket.emit("getRole", socket.id, (assignedRole) => setRole(assignedRole));
    socket.on("roleAssigned", (role) => {
      console.log("Assigned role:", role);
      setRole(role);
    });

    socket.on("mentorLeft", () => {
      console.log("Mentor left the room. Returning to lobby.");
      navigate("/");
    });

    return () => {
      socket.emit("leaveRoom", socket.id);
      socket.off("mentorLeft");
      socket.off("roleAssigned");
      socket.off("codeUpdate");
      socket.off("userCount");
      
    };
  }, [currCodeBlock]);

  // עדכון קוד ב-Socket
  const handleCodeChange = (e) => {
    //console.log("Code change:", e.target.value);
    setCode(e.target.value);
    console.log('currCodeBlock.name:',currCodeBlock.name);
    socket.emit("codeChange", currCodeBlock.name, e.target.value);
    setIsCorrect(e.target.value.trim() === currCodeBlock.solution.trim());
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
