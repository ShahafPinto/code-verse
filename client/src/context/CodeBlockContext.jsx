import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
export const CodeBlockContext = createContext();

export const CodeBlockProvider = ({ children }) => {
  const [codeBlockList, setCodeBlockList] = useState([]);
  const [currCodeBlock, setCurrCodeBlock] = useState({});
  const [code, setCode] = useState(currCodeBlock.template || "");
  //axios.get(`https://code-verse-h9i9.onrender.com/getCodeBlocks`)
  //axios.get(`http://localhost:5000/getCodeBlocks`)

  useEffect(() => {
    axios
      .get(`https://code-verse-h9i9.onrender.com/getCodeBlocks`)
      .then((codeBlockList) => setCodeBlockList(codeBlockList.data))
      .catch((error) => console.log(error));
  }, []);

  const handleCodeBlockClick = (id) => {
    const currCodeBlock = codeBlockList.find((block) => block._id === id);
    setCurrCodeBlock(currCodeBlock);
  };
  return (
    <CodeBlockContext.Provider
      value={{
        codeBlockList,
        setCodeBlockList,
        CurrCodeBlock: currCodeBlock,
        setCurrCodeBlock,
        code,
        setCode,
        handleCodeBlockClick,
      }}
    >
      {children}
    </CodeBlockContext.Provider>
  );
};
