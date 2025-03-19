import React from "react";

interface TooltipProps {
  isVisible: boolean;
  text: string;
  styles?: React.CSSProperties;
}

const Tooltip: React.FC<TooltipProps> = ({ isVisible, text, styles }) => {
  if (!isVisible) return null;

  return (
    <span
      className="absolute top-8 left-0 text-black p-1 rounded-md shadow-md pointer-events-none bg-white"
      style={{
        textAlign: "center",
        fontSize: "12px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        ...styles,
      }}
    >
      {text}
    </span>
  );
};

export default Tooltip;
