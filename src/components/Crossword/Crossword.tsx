import React, { useState } from "react";
import styled from "styled-components";
import {EditorState, EditorActions} from "./Editor";
import {SolverState, SolverActions} from "./Solver";

const CrosswordContainer = styled.div`
  display: grid;
  grid-template: repeat(15, 30px) / repeat(15, 30px);
  width: min-content;
  background-color: black;
  border: 2px solid black;
  grid-row-gap: 2px;
  grid-column-gap: 2px;
  margin: auto;
  margin-top: 10px;
  margin-bottom: 10px;
`;

interface InputCSSProps {
  blackSquare: boolean;
}

const SquareInput = styled.input<InputCSSProps>`
  border: none;
  background-color: ${(props) => (props.blackSquare ? "black" : "white")};
  font-size: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: black;
  &:hover {
    background-color: ${(props) => (props.blackSquare ? "black" : "#aaaaff")};
  }
`;
type Props = {
  state: EditorState,
  dispatch: React.Dispatch<EditorActions>,
  isEditable: true
} | {
  state: SolverState,
  dispatch: React.Dispatch<SolverActions>,
  isEditable: false
}

export const Crossword: React.FC<Props> = (props) => {
  const { state, dispatch, isEditable } = props;

  const [isDown, setIsDown] = useState(true);

  const getNextBox = (i: number): number => {
    const across = i < metaData.length - 1 ? i + 1 : i;
    const down = i < metaData.length - 15 ? i + 15 : (i % 15) + 1;
    return isDown ? down : across;
  };

  const metaData =
    state.chars.map((char) => ({
      character: char,
      ref: React.createRef<HTMLInputElement>(),
    }));

  const inputs = metaData.map((meta, i) => {
    const { ref, character } = meta;
    return (
      <SquareInput
        blackSquare={character === "."}
        type="text"
        maxLength={1}
        value={state.chars[i] === "." ? "" : state.chars[i]}
        ref={ref}
        onFocus={(e) => {
          e.target.select();
        }}
        onKeyDown={(e) => {
          if (e.keyCode === 32) {
            e.preventDefault();
            setIsDown((state) => !state);
          }
        }}
        onChange={(e) => {
          e.preventDefault();
          if (e.target.value.match(`[a-zA-Z${isEditable && "."}]`)) {
            (metaData[getNextBox(i)].ref.current as HTMLElement)?.focus();
            if (isEditable && e.target.value === ".") {
              (dispatch as React.Dispatch<EditorActions>)({
                type: "TOGGLE_BLACK_SPACE",
                index: i
              });
              return;
            }
            dispatch({
              type: "SET_LETTER",
              payload: { index: i, newVal: e.target.value.toUpperCase() },
            });
          } else if (e.target.value === "") {
            dispatch({
              type: "SET_LETTER",
              payload: { index: i, newVal: e.target.value.toUpperCase() },
            });
          }
        }}
      />
    );
  });
  return (
    <>
      <CrosswordContainer {...props}>{inputs}</CrosswordContainer>
      <button onClick={() => dispatch({type: "RESET"})}>Reset</button>
      <h3>{isDown ? "Down" : "Across"}</h3>
      <h3>
        {`index:${state.lastChanged} row:${Math.floor(
          state.lastChanged / 15
        )} col:${state.lastChanged % 15}`}
      </h3>
      <p>Use the space bar to toggle direction.</p>
      {isEditable && <p>Use . to toggle a black square</p>}
    </>
  );
};

export default Crossword