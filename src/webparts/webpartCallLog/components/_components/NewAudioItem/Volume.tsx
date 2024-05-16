import * as React from "react";
import styles from "./NAudio.module.scss";

interface IVolume {
  handleChange: (e: React.ChangeEvent) => void;
}
const Volume = ({ handleChange }: IVolume) => {
  return (
    <div className={styles.sliderContainer}>
      <input
        type="range"
        min="0"
        max="100"
        defaultValue={100}
        onChange={handleChange}
        className={styles.volumeSlider}
      />
    </div>
  );
};

export default Volume;
