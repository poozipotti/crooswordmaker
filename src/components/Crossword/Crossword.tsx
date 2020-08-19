import React, { useState } from "react";
import styled from "styled-components";
import { EditorState, EditorActions } from "./Editor";
import { SolverState, SolverActions } from "./Solver";

export type Box = {
  char: string;
  label: number | undefined;
  wordAcrossLabel?: number;
  wordDownLabel?: number;
};

export enum WordDirection {
  down,
  across
}

export interface Questions {
  [questionNumber: number]: Question
}

export type Question = {
  down: undefined | string
  across: undefined | string
};

const CrosswordContainer = styled.div`
  display: grid;
  grid-template: repeat(15, 30px) / repeat(15, 30px);
  width: min-content;
  grid-row-gap: 2px;
  grid-column-gap: 2px;
  margin: auto;
  margin-top: 10px;
  margin-bottom: 10px;
`;

interface InputCSSProps {
  blackSquare: boolean;
}

const SquareDiv = styled.div`
  display: flex;
`;

const SquareInput = styled.input<InputCSSProps>`
  border: 1px solid black;
  height: 30px;
  width: 30px;
  background-color: ${props => (props.blackSquare ? "black" : "white")};
  font-size: 1rem;
  display: flex;
  justify-self: center;
  align-self: center;
  text-align: center;
  color: black;
  &:hover {
    background-color: ${props => (props.blackSquare ? "black" : "#aaaaff")};
  }
`;

const InputLabel = styled.label`
  position: absolute;
  font-size: 0.5rem;
  height: 0;
  width: 0;
  z-index: 10;
`;

type Props =
  | {
      state: EditorState;
      dispatch: React.Dispatch<EditorActions>;
      isEditable: true;
    }
  | {
      state: SolverState;
      dispatch: React.Dispatch<SolverActions>;
      isEditable: false;
    };

export const Crossword: React.FC<Props> = props => {
  const { state, dispatch, isEditable } = props;

  const [isDown, setIsDown] = useState(true);

  const getNextBox = (i: number): number => {
    const across = i < metaData.length - 1 ? i + 1 : i;
    const down = i < metaData.length - 15 ? i + 15 : (i % 15) + 1;
    return isDown ? down : across;
  };

  const metaData = state.boxes.map(box => ({
    character: box.char,
    ref: React.createRef<HTMLInputElement>()
  }));

  const inputs = metaData.map((meta, i) => {
    const { ref, character } = meta;
    return (
      <SquareDiv key={i}>
        <InputLabel>{state.boxes[i].label}</InputLabel>
        <SquareInput
          blackSquare={character === "."}
          type="text"
          maxLength={1}
          value={state.boxes[i].char === "." ? "" : state.boxes[i].char}
          ref={ref}
          onFocus={e => {
            e.target.select();
          }}
          onKeyDown={e => {
            if (e.keyCode === 32) {
              e.preventDefault();
              setIsDown(state => !state);
            }
          }}
          onChange={e => {
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
                payload: { index: i, newVal: e.target.value.toUpperCase() }
              });
            } else if (e.target.value === "") {
              dispatch({
                type: "SET_LETTER",
                payload: { index: i, newVal: e.target.value.toUpperCase() }
              });
            }
          }}
        />
      </SquareDiv>
    );
  });
  return (
    <>
      <CrosswordContainer {...props}>{inputs}</CrosswordContainer>
      <button onClick={() => dispatch({ type: "RESET" })}>Reset</button>
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

export default Crossword;
