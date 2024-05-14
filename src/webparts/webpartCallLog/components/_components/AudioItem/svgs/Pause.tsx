import * as React from "react";

const Pause: React.FC<{
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
}> = ({ onClick, active, disabled }) => (
  <svg
    onClick={onClick}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
    }}
  >
    <path d="M6 4H10V20H6V4ZM14 4H18V20H14V4Z" fill="currentColor" />
  </svg>
);

export default Pause;
