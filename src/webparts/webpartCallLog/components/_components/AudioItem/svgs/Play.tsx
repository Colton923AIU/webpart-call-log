import * as React from "react";
import { ISVGProps } from "./svg.types";
import styles from "./SVG.module.scss";

const Play: ({ onClick, styleProps }: ISVGProps) => JSX.Element = ({
  onClick,
  styleProps,
}: ISVGProps) => {
  const w: () => string | number = () => {
    let w: string | number = "50px";
    if (styleProps?.width) {
      w = styleProps.width;
    }
    return w;
  };
  const h: () => string | number = () => {
    let h: string | number = "50px";
    if (styleProps?.height) {
      h = styleProps.height;
    }
    return h;
  };
  return (
    <svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width={w()}
      height={h()}
      viewBox={`0 0 ${w()} ${h()}`}
      preserveAspectRatio="xMidYMid meet"
      onClick={
        onClick
          ? () => {
              onClick();
            }
          : () => null
      }
      className={styles.svgStyles}
    >
      <g
        transform="translate(0,50) scale(0.1,-0.1)"
        fill={"#006000"}
        stroke="none"
      >
        <path
          d="M155 456 c-60 -28 -87 -56 -114 -116 -36 -79 -19 -183 42 -249 33
-36 115 -71 167 -71 52 0 134 35 167 71 34 37 63 110 63 159 0 52 -35 134 -71
167 -37 34 -110 63 -159 63 -27 0 -65 -10 -95 -24z m180 -15 c128 -58 164
-223 72 -328 -101 -115 -283 -88 -348 52 -79 171 104 354 276 276z"
        />
        <path
          d="M180 250 c0 -60 3 -110 6 -110 12 0 184 103 184 110 0 7 -172 110
-184 110 -3 0 -6 -49 -6 -110z m140 10 c17 -11 20 -9 -67 -61 l-53 -31 0 82 0
82 53 -31 c28 -17 59 -36 67 -41z"
        />
      </g>
    </svg>
  );
};

export default Play;
