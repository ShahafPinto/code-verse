import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CodeBlockContext } from '../context/CodeBlockContext';

const Lobby=()=> {
  const navigate = useNavigate();
  const {codeBlockList, setCodeBlockList, setCurrCodeBlock} = useContext(CodeBlockContext);
  
  useEffect(() => {
    axios.get('http://localhost:5000/getCodeBlocks')
      .then(codeBlockList => setCodeBlockList(codeBlockList.data))
      .catch(error => console.log(error))
  }, []);

  const handleCodeBlockClick = (id) => {
    const currCodeBlock = codeBlockList.find(block => block._id === id);
    setCurrCodeBlock(currCodeBlock);
    return () =>{
      navigate(`/codeblock/${id}`);
    }
  }

  return (
    <div>
      <h1>Choose code block</h1>
      <ul>
        {codeBlockList.map(block => {
          return (
            <li key={block._id} onClick={handleCodeBlockClick(block._id)}>
            {block.name}
          </li>
          )
        })}
      </ul>
    </div>
  );
}

export default Lobby;
