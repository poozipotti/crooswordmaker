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
const SquareInput = styled.input`
  border: none;
  background-color: white;
  font-size: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: black;
  &:hover {
    background-color: #aaaaff;
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

type Actions = {
  type: "SET_LETTER";
  payload: { index: number; newVal: string };
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
    default:
      throw new Error();
  }
}

export const Crossword: React.FC<Props> = (props) => {
  const { inputString } = props;

  if (inputString.length !== 15 * 15) {
    throw new Error(
      `input string is not the correct length it is ${
        inputString.length
      } instead of ${15 * 15} characters`
    );
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const [isDown, setIsDown] = useState(true);

  const getNextBox = (i: number): number => {
    const accross = i < metaData.length - 1 ? i + 1 : i;
    const down = i < metaData.length - 15 ? i + 15 : (i % 15) + 1;
    return isDown ? down : accross;
  };

  const metaData = inputString
    .split("")
    .map((char) => ({
      character: char,
      ref: React.createRef<HTMLInputElement>(),
    }));

  const inputs = metaData.map((meta, i) => {
    const { ref, character } = meta;
    return character === "0" ? (
      <SquareInput
        type="text"
        maxLength={1}
        value={state.chars[i]}
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
          if (e.target.value.match("[a-za-z]") && e.target.value !== "") {
            (metaData[getNextBox(i)].ref.current as HTMLElement)?.focus();
            dispatch({
              type: "SET_LETTER",
              payload: { index: i, newVal: e.target.value.toUpperCase() },
            });
          }
        }}
      />
    ) : (
      <div />
    );
  });
  return (
    <>
      <CrosswordContainer {...props}>{inputs}</CrosswordContainer>
      <h3>{isDown ? "Down" : "Accross"}</h3>
      <h3>
        {`index:${state.lastChanged} row:${Math.floor(
          state.lastChanged / 15
        )} col:${state.lastChanged % 15}`}
      </h3>
    </>
  );
};
