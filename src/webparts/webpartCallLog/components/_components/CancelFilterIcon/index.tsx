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
      cursor={"pointer"}
    >
      <polygon
        opacity=".5"
        points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"
      />
      <line x1={5} y1={5} x2={18} y2={18} />
      <line x1={18} y1={5} x2={5} y2={18} />
    </svg>
  );
}
