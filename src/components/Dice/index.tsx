import React from "react";

interface DiceProps {
  id: string;
}
const Dice = (props: DiceProps) => {
  const { id } = props;
  return (
    <div id={id} className="dice">
      <div className="face front">
        <span className="dot deer" />
      </div>
      <div className="face back">
        <span className="dot gourd" />
      </div>
      <div className="face right">
        <span className="dot chicken" />
      </div>
      <div className="face left">
        <span className="dot fish" />
      </div>
      <div className="face top">
        <span className="dot crab" />
      </div>
      <div className="face bottom">
        <span className="dot shrimp" />
      </div>
  </div>
  );
}

export default React.memo(Dice);
