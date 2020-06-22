import React, { useReducer } from "react";
import Crossword, { Box } from "./Crossword";

export interface EditorState {
  boxes: Box[];
  lastChanged: number;
}

const initialState: EditorState = {
  boxes: new Array(15 * 15)
    .fill({ char: "", label: undefined })
    .map((elem, i) => {
      if (i < 15) {
        return { ...elem, label: i + 1 };
      } else if (i % 15 === 0) {
        return { ...elem, label: i / 15 + 15 };
      }
      return elem;
    }),
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
        boxes: state.boxes.map((elem, i) =>
          i === index ? { ...elem, char: newVal } : elem
        ),
      };
    case "TOGGLE_BLACK_SPACE":
      const newBoxes = state.boxes.map((elem, i) => {
        if (i === action.index || i === 15 * 15 - 1 - action.index) {
          return elem.char === "."
            ? { ...elem, char: "" }
            : { ...elem, char: "." };
        }
        return elem;
      });
      return {
        ...state,
        lastChanged: action.index,
        boxes: updateLabels(newBoxes),
      };
    case "RESET":
      return initialState;
    default:
      throw new Error();
  }
}
 
const updateLabels = (boxes: Box[]) => {
  let count = 1;
  return boxes.map((elem, i) => (
    boxes[i].char !== "." &&
      (i < 15 ||
        i % 15 === 0 ||
        boxes[i - 1].char === "." ||
        boxes[i - 15].char === ".")
      ? { ...elem, label: count++ }
      : { ...elem, label: undefined }
  ));
}; 

export const Editor: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <Crossword state={state} dispatch={dispatch} isEditable={true} />
      <button>Save Puzzle</button>
    </>
  );
};
