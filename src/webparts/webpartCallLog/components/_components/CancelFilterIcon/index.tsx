import * as React from "react";
export default function CancelFilterIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon
        opacity=".5"
        points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"
      />
      <line x1={3} y1={3} x2={20} y2={20} />
      <line x1={20} y1={3} x2={3} y2={20} />
    </svg>
  );
}
