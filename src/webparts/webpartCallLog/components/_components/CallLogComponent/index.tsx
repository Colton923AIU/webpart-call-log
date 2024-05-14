import * as React from "react";
import styles from "./NewAudioItem.module.scss"; // Import SCSS styles

export default function CallLogComponent({
  children,
  description,
}: {
  children: React.ReactNode;
  description: string;
}) {
  return (
    <section className={styles.sectionContainer}>
      <div className={styles.flexContainer}>
        <div className={styles.gridContainer}>
          <h1 className={styles.heading}>{description}</h1>
        </div>
        <div className={styles.flexContainer}>{children}</div>
      </div>
    </section>
  );
}
