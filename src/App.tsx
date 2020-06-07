import React, {useState} from 'react';
import styled from 'styled-components'
import {Editor} from './components/Crossword/Editor';
import {Solver} from './components/Crossword/Solver';

const AppContainer = styled.div`
    margin:0;
    padding:0;
    width: 100vw;
    height: 100vh;
`

function App() {
  const [isEditing, setIsEditing] = useState<boolean>(true);
  return (
    <AppContainer>
      {isEditing ? <Editor/> : <Solver/>}
    <button onClick={(): void => setIsEditing(!isEditing)}>Click to {isEditing? "solve" : "create"} a puzzle!</button>
    </AppContainer>
  );
}

export default App;
