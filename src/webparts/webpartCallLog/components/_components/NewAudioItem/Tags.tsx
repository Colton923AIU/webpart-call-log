import * as React from "react";
import styles from "./Tags.module.scss";

const colors = [
  "#4605af10",
  "#c0008e10",
  "#fa036710",
  "#ff724710",
  "#ffb94210",
  "#f9f87110",
];

interface ITags {
  tags: string[];
}

const Tags: React.FC<ITags> = ({ tags }) => {
  return (
    <div className={styles.tags}>
      {tags.map((tag, index) => {
        return (
          <span
            key={`tag_${index}`}
            className={styles.tag}
            style={{ backgroundColor: colors[index % 6] }}
          >
            {tag}
          </span>
        );
      })}
    </div>
  );
};

export default Tags;
