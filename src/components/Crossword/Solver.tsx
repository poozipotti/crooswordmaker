import React, { useReducer } from "react";
import Crossword, { Box }  from "./Crossword";

export interface SolverState {
  boxes: Box[];
  lastChanged: number;
}

const initialState: SolverState = {
  boxes: new Array(15 * 15).fill(""),
  lastChanged: 0,
};

export type SolverActions =
  | {
      type: "SET_LETTER";
      payload: { index: number; newVal: string };
    }
  | {
      type: "RESET";
    };

function reducer(state: SolverState, action: SolverActions) {
  switch (action.type) {
    case "SET_LETTER":
      const { index, newVal } = action.payload;
      return {
        ...state,
        lastChanged: index,
        boxes: state.boxes.map((elem, i) => (i === index ? {...elem, char: newVal} : elem)),
      };
    case "RESET":
      return initialState;
    default:
      throw new Error();
  }
}

export const Solver: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <Crossword state={state} dispatch={dispatch} isEditable={false} />
      <button>Submit</button>
    </>
  );
};
