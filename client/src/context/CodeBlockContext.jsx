import React, { createContext, useState } from "react";

export const CodeBlockContext = createContext();

export const CodeBlockProvider = ({ children }) => {
  const [codeBlockList, setCodeBlockList] = useState([]);
  const [CurrCodeBlock, setCurrCodeBlock] = useState({});
  
  return (
    <CodeBlockContext.Provider
      value={{
        codeBlockList,
        setCodeBlockList,
        CurrCodeBlock,
        setCurrCodeBlock,
      }}
    >
      {children}
    </CodeBlockContext.Provider>
  );
};
