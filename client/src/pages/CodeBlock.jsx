import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import axios from "axios";

const socket = io("http://localhost:5000"); // כתובת השרת שלך

// קוד התחלה ופתרונות

const CodeBlock=()=> {
  const {  id } = useParams();
  console.log(id);
  const navigate = useNavigate();
  const [codeBlock, setCodeBlock] = useState({});


  const [code, setCode] = useState(codeBlock.template || "");
  const [role, setRole] = useState("student"); // ברירת מחדל - סטודנט
  const [students, setStudents] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  
  useEffect(() => {
    if (!id) return;
    axios.get(`http://localhost:5000/getCodeBlock/${id}`)
      .then(codeBlock => {setCodeBlock(codeBlock.data)
        setCode(codeBlock.data.template)
      })
      .catch(error => {
        console.log("error fatching the data:",error)
        navigate("/");
      })
  }, [id]);

  useEffect(() => {
    // התחברות ל-Socket
    socket.emit("joinRoom", id);
    
    // קבלת מספר סטודנטים בחדר
    socket.on("updateStudents", (count) => setStudents(count));

    // קבלת עדכון קוד מ-Socket
    socket.on("codeUpdate", (newCode) => setCode(newCode));

    // זיהוי התפקיד (הראשון שנכנס הוא מנטור)
    socket.emit("getRole", id, (assignedRole) => setRole(assignedRole));

    return () => {
      socket.emit("leaveRoom", id);
      socket.off("updateStudents");
      socket.off("codeUpdate");
    };
  }, [id, navigate]);

  // עדכון קוד ב-Socket
  const handleCodeChange = (e) => {
    setCode(e.target.value);
    socket.emit("codeUpdate", id, e.target.value);
    setIsCorrect(e.target.value.trim() ===codeBlock.solution.trim());
  };

  return (
    <div>
      <h1>{codeBlock.name}</h1>
      <p>Role: {role} | Students: {students}</p>

      {role === "mentor" ? (
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {code}
        </SyntaxHighlighter>
      ) : (
        <textarea value={code} onChange={handleCodeChange} rows={10} cols={50} />
      )}

      {isCorrect && <h2>🎉😊 Correct! 😊🎉</h2>}
      <button onClick={() => navigate("/")}>Back to Lobby</button>
    </div>
  );
}

export default CodeBlock;
