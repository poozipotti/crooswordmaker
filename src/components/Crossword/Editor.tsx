import React, { useReducer } from "react";
import Crossword, { Box, Questions, Question } from "./Crossword";

export interface EditorState {
  boxes: Box[];
  lastChanged: number;
  questions: Questions;
}

const initialBoxes = () =>
  new Array(15 * 15).fill({ char: "", label: undefined }).map((elem, i) => {
    if (i < 15) {
      return { ...elem, label: i + 1 };
    } else if (i % 15 === 0) {
      return { ...elem, label: i / 15 + 15 };
    }
    return elem;
  });
const getQuestions = (boxes: Box[], questions: Questions) => {
  return boxes.reduce(
    (questionMap, elem, i) =>
      elem.label
        ? {
            ...questionMap,
            [elem.label]: {
              down:
                i < 15 || boxes[i - 15].char === "."
                  ? questions[elem.label]?.down || ""
                  : undefined,
              across:
                i % 15 === 0 || boxes[i - 1].char === "."
                  ? questions[elem.label]?.across || ""
                  : undefined
            }
          }
        : questionMap,
    {}
  );
};

const initialState: EditorState = {
  boxes: initialBoxes(),
  lastChanged: 0,
  questions: getQuestions(initialBoxes(), {})
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
    }
  | {
      type: "UPDATE_QUESTION";
      payload: { [questionNumber: number]: Question };
    };

const reducer = (state: EditorState, action: EditorActions) => {
  switch (action.type) {
    case "SET_LETTER":
      const { index, newVal } = action.payload;
      return {
        ...state,
        lastChanged: index,
        boxes: state.boxes.map((elem, i) =>
          i === index ? { ...elem, char: newVal } : elem
        )
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
      const updatedBoxes = updateLabels(newBoxes);
      return {
        ...state,
        lastChanged: action.index,
        boxes: updatedBoxes,
        questions: getQuestions(updatedBoxes, state.questions)
      };
    case "RESET":
      return initialState;
    case "UPDATE_QUESTION":
      return {
        ...state,
        questions: { ...state.questions, ...action.payload }
      };
    default:
      throw new Error();
  }
};

const updateLabels = (boxes: Box[]) => {
  let count = 1;
  return boxes.map((elem, i) =>
    boxes[i].char !== "." &&
    (i < 15 ||
      i % 15 === 0 ||
      boxes[i - 1].char === "." ||
      boxes[i - 15].char === ".")
      ? { ...elem, label: count++ }
      : { ...elem, label: undefined }
  );
};

const QuestionContainer: React.FC<{
  question: Questions;
  across: boolean;
  dispatch: React.Dispatch<EditorActions>;
}> = ({ question, across, dispatch }) => {
  const [questionNumber, fullQuestion] = Object.entries(question)[0];
  const questionText =
    across ? fullQuestion.accross : fullQuestion.down;
  return (
    <div style={{ display: "flex", width: "100%" }}>
      <div style={{ width: "2rem" }}>{questionNumber}</div>
      <input
        value={questionText}
        onChange={e => {
          dispatch({
            type: "UPDATE_QUESTION",
            payload: {
              [questionNumber]: {
                across: across ? e.target.value : fullQuestion.across,
                down: !across ? e.target.value : fullQuestion.down
              }
            }
          });
        }}
      />
    </div>
  );
};

const QuestionsContainer: React.FC<{
  questions: Questions;
  dispatch: React.Dispatch<EditorActions>;
}> = ({ questions, dispatch }) => (
  <div style={{ height: "70vh", overflow: "scroll" }}>
    <h1> Questions</h1>
    <h2> across </h2>
    <div>
      {Object.entries(questions)
        .filter(([, question]) => question.across !== undefined)
        .map(([questionNumber, question]) => (
          <QuestionContainer
            across={true}
            question={{ [questionNumber]: question }}
            dispatch={dispatch}
          />
        ))}
    </div>
    <h2> down </h2>
    <div>
      {Object.entries(questions)
        .filter(([, question]) => question.down !== undefined)
        .map(([questionNumber, question]) => (
          <QuestionContainer
            across={false}
            question={{ [questionNumber]: question }}
            dispatch={dispatch}
          />
        ))}
    </div>
  </div>
);

export const Editor: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div style={{ display: "grid", gridTemplate: "1fr / 1fr 2fr" }}>
      <QuestionsContainer questions={state.questions} dispatch={dispatch} />
      <Crossword state={state} dispatch={dispatch} isEditable={true} />
      <div></div>
      <button>Save Puzzle</button>
    </div>
  );
};
