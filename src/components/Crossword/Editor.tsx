import React, { useReducer } from "react";
import Crossword from "./Crossword";

export interface EditorState {
  chars: string[];
  lastChanged: number;
}

const initialState: EditorState = {
  chars: new Array(15 * 15).fill(""),
  lastChanged: 0,
};

export type EditorActions =
  | {
      type: "SET_LETTER";
      payload: { index: number; newVal: string };
    }
  | {
      type: "TOGGLE_BLACK_SPACE";
      index: number;
    }
  | {
      type: "RESET";
    };

function reducer(state: EditorState, action: EditorActions) {
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
          if (i === action.index || i === 15 * 15 - 1 - action.index) {
            return elem === "." ? "" : ".";
          }
          return elem;
        }),
      };
    case "RESET":
      return initialState;
    default:
      throw new Error();
  }
}

export const Editor: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <Crossword state={state} dispatch={dispatch} isEditable={true} />
      <button>Save Puzzle</button>
    </>
  );
};
