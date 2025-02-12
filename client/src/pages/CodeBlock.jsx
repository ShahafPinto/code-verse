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
  const {
    codeBlockList,
    code,
    setCode,
  } = useContext(CodeBlockContext);
  
  const [currCodeBlock, setCurrCodeBlock] = useState(null);
  const [socket, setSocket] = useState(null);

  const [role, setRole] = useState("student"); // ברירת מחדל - סטודנט
  const [students, setStudents] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    const currBlock = codeBlockList.find(block => block._id === id);
    setCurrCodeBlock(currBlock);
    setCode(currBlock.template);
  }, []);

  let newSocket;

  useEffect(() => {
    if (socket !== null) return;
    newSocket = io("http://localhost:5000");
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!newSocket || !currCodeBlock) return;
    // התחברות ל-Socket
    newSocket.emit("joinRoom", currCodeBlock.name);

    // קבלת מספר סטודנטים בחדר
    newSocket.on("updateStudents", (count) => setStudents(count));

    // קבלת עדכון קוד מ-Socket
    newSocket.on("codeUpdate", (newCode) => setCode(newCode));

    // זיהוי התפקיד (הראשון שנכנס הוא מנטור)
    newSocket.emit("getRole", newSocket.id, (assignedRole) =>
      setRole(assignedRole)
    );

    return () => {
      newSocket.emit("leaveRoom", newSocket.id);
      newSocket.off("updateStudents");
      newSocket.off("codeUpdate");
    };
  }, [currCodeBlock]);

  // עדכון קוד ב-Socket
  const handleCodeChange = (e) => {
    setCode(e.target.value);
    socket.emit("codeUpdate", currCodeBlock._id, e.target.value);
    setIsCorrect(e.target.value.trim() === currCodeBlock.solution.trim());
  };

  return (
    <div>
      <h1>{currCodeBlock?.name}</h1>
      <p>
        Role: {role} | Students: {students}
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
