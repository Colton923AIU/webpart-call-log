import { CSSProperties } from "react";

type TISVGPropsOnClickProps = Record<string, string>;

export interface ISVGProps {
  onClick?: (props?: TISVGPropsOnClickProps) => void;
  styleProps?: Partial<CSSProperties>;
  active?: boolean;
}
