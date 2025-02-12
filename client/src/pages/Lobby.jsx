import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Lobby=()=> {
  const navigate = useNavigate();
  const [codeBlocks, setCodeBlocks] = React.useState([]);
  
  useEffect(() => {
    axios.get('http://localhost:5000/getCodeBlocks')
      .then(codeBlocks => setCodeBlocks(codeBlocks.data))
      .catch(error => console.log(error))
  }, []);

  return (
    <div>
      <h1>Choose code block</h1>
      <ul>
        {codeBlocks.map(block => {
          return (
            <li key={block._id} onClick={() => navigate(`/codeblock/${block._id}`)}>
            {block.name}
          </li>
          )
        })}
      </ul>
    </div>
  );
}

export default Lobby;
