import React from 'react';
import styled from 'styled-components'
import {Crossword} from './components/Crossword/Crossword';

const AppContainer = styled.div`
    margin:0;
    padding:0;
    width: 100vw;
    height: 100vh;
`

function App() {
  return (
    <AppContainer>
      <Crossword 
        inputString={
          //sorry this is horrible it will be generated usually
          // 0 for input 1 for black box
           '000000000000000'
          +'000000000000000'
          +'000010000000000'
          +'000010000000000'
          +'000010000000000'
          +'000000000000000'
          +'000001000000000'
          +'000001000000000'
          +'000000000010000'
          +'000000000010000'
          +'000000000010000'
          +'000000000010000'
          +'000000000000000'
          +'000000000000000'
          +'000000000000000'
        } 
        
      />
    </AppContainer>
  );
}

export default App;
