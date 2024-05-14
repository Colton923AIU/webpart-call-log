import * as React from "react";

const PlayIcon: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <svg
    onClick={onClick}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ cursor: "pointer" }}
  >
    <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
  </svg>
);

export default PlayIcon;
