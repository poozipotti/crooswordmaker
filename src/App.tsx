import React from 'react';
import styled from 'styled-components'
import {Crossword} from './components/Crossword/Crossworld';

const AppContainer = styled.div`
    margin:0;
    padding:0;
    width: 100vw;
    height: 100vh;
`

function App() {
  return (
    <AppContainer>
      <Crossword />
    </AppContainer>
  );
}

export default App;
