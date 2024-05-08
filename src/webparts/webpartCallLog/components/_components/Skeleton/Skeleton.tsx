import * as React from "react";
import styles from "./Skeleton.module.scss";

const Circle = ({ h, w }: { h: number; w: number }) => {
  return (
    <div
      style={{
        width: w,
        height: h,
      }}
      className={styles.circle}
    />
  );
};

const Square = ({ h, w }: { h: number; w: number }) => {
  return (
    <div
      style={{
        width: w,
        height: h,
      }}
      className={styles.square}
    />
  );
};

type SkeletonOptions = {
  type: "Circle" | "Square";
  h: number;
  w: number;
};

const Skeleton = (options: SkeletonOptions) => {
  if (options.type === "Circle") {
    return <Circle h={options.h} w={options.w} />;
  } else if (options.type === "Square") {
    return <Square h={options.h} w={options.w} />;
  } else {
    return <Square h={30} w={180} />;
  }
};

const SkeletonCardWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.card}>{children}</div>;
};

const DefaultCardSkele = () => {
  return (
    <SkeletonCardWrapper>
      <Skeleton h={100} w={100} type={"Circle"} />
      <Skeleton h={40} w={120} type={"Square"} />
      <Skeleton h={40} w={120} type={"Square"} />
      <Skeleton h={40} w={120} type={"Square"} />
      <Skeleton h={40} w={120} type={"Square"} />
    </SkeletonCardWrapper>
  );
};

export { Skeleton, SkeletonCardWrapper, DefaultCardSkele };
