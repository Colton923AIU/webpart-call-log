import * as React from "react";

const Skip: React.FC<{ onClick?: () => void; disabled?: boolean }> = ({
  onClick,
  disabled,
}) => (
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
      transform: "rotate(180deg)",
    }}
  >
    <path
      d="M4 4V20L10 12L4 4ZM10 4V20L16 12L10 4ZM16 4V20H18V4H16Z"
      fill="currentColor"
    />
  </svg>
);

export default Skip;
