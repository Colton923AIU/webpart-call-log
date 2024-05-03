import { CSSProperties } from "react";

type TISVGPropsOnClickProps = Record<string, string>;

export interface ISVGProps {
  onClick?: (props?: TISVGPropsOnClickProps) => void;
  disabled?: boolean;
  styleProps?: Partial<CSSProperties>;
  active?: boolean;
}
