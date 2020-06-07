import React, { useReducer, useState } from "react";
import styled from "styled-components";

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
interface Props {
  inputString: string;
}

interface State {
  chars: string[];
  lastChanged: number;
}

const initialState: State = {
  chars: new Array(15 * 15).fill(""),
  lastChanged: 0,
};

type Actions =
  | {
      type: "SET_LETTER";
      payload: { index: number; newVal: string };
    }
  | {
      type: "TOGGLE_BLACK_SPACE";
      index: number;
    };

function reducer(state: State, action: Actions) {
  switch (action.type) {
    case "SET_LETTER":
      const { index, newVal } = action.payload;
      return {
        ...state,
        lastChanged: index,
        chars: state.chars.map((elem, i) => (i === index ? newVal : elem)),
      };
    case "TOGGLE_BLACK_SPACE":
      return {
        ...state,
        lastChanged: action.index,
        chars: state.chars.map((elem, i) => {
          if(i === action.index || i === (15*15-1 - action.index)){
            return elem === "."? "" : ".";
          }
          return elem;
        }),
      };
    default:
      throw new Error();
  }
}

export const Crossword: React.FC<Props> = (props) => {
  /* const { inputString } = props;

  if (inputString.length !== 15 * 15) {
    throw new Error(
      `input string is not the correct length it is ${
        inputString.length
      } instead of ${15 * 15} characters`
    );
  } */

  const [state, dispatch] = useReducer(reducer, initialState);
  const [isDown, setIsDown] = useState(true);
  const isEditable = true;

  const getNextBox = (i: number): number => {
    const across = i < metaData.length - 1 ? i + 1 : i;
    const down = i < metaData.length - 15 ? i + 15 : (i % 15) + 1;
    return isDown ? down : across;
  };

  const metaData =
    /* inputString
    .split("") */
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
              dispatch({
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
      <h3>{isDown ? "Down" : "Across"}</h3>
      <h3>
        {`index:${state.lastChanged} row:${Math.floor(
          state.lastChanged / 15
        )} col:${state.lastChanged % 15}`}
      </h3>
      <p>Use the space bar to toggle direction.</p>
      <p>Use . to toggle a black square</p>
    </>
  );
};
