import * as React from "react";
import styles from "./NAudio.module.scss";

const Duration = ({ duration }: { duration: number }) => {
  if (duration === Infinity) {
    return <span className={styles.durationRoot}>{`...`}</span>;
  }
  if (isNaN(duration)) {
    return <span className={styles.durationRoot}>{"..."}</span>;
  }
  return <span className={styles.durationRoot}>{duration}</span>;
};

export default Duration;
