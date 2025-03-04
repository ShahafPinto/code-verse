import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CodeBlockContext } from "../context/CodeBlockContext";

const Lobby = () => {
  const navigate = useNavigate();
  const { codeBlockList, setCurrCodeBlock } = useContext(CodeBlockContext);

  const handleCodeBlockClick = (id) => {
    const currCodeBlock = codeBlockList.find((block) => block._id === id);
    setCurrCodeBlock(currCodeBlock);
    return () => {
      navigate(`/codeblock/${id}`);
    };
  };

  return (
    <div>
      <h1>Choose code block</h1>
      <ul>
        {codeBlockList.map((block) => {
          return (
            <li key={block._id} onClick={handleCodeBlockClick(block._id)}>
              {block.title}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Lobby;
