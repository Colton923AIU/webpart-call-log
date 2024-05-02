import * as React from "react";
import { ISVGProps } from "./svg.types";
import styles from "./SVG.module.scss";

const Skip: ({ onClick, styleProps }: ISVGProps) => JSX.Element = ({
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
        fill="#000000"
        stroke="none"
      >
        <path
          d="M155 456 c-60 -28 -87 -56 -114 -116 -36 -79 -19 -183 42 -249 33
-36 115 -71 167 -71 52 0 134 35 167 71 34 37 63 110 63 159 0 52 -35 134 -71
167 -37 34 -110 63 -159 63 -27 0 -65 -10 -95 -24z m180 -15 c128 -58 164
-223 72 -328 -101 -115 -283 -88 -348 52 -79 171 104 354 276 276z"
        />
        <path
          d="M283 349 l-103 -69 0 65 0 65 -40 0 -40 0 0 -160 0 -160 40 0 40 0 0
65 0 65 105 -70 105 -70 0 170 c0 93 -1 170 -2 169 -2 0 -49 -32 -105 -70z
m-123 -99 c0 -133 -1 -140 -20 -140 -19 0 -20 7 -20 140 0 133 1 140 20 140
19 0 20 -7 20 -140z m208 -64 l-3 -64 -90 59 c-50 32 -90 63 -90 69 0 6 40 37
90 69 l90 59 3 -64 c2 -35 2 -93 0 -128z"
        />
      </g>
    </svg>
  );
};

export default Skip;
