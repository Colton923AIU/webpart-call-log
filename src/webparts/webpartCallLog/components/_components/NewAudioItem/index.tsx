import styles from "./NAudio.module.scss";
import type { SPHttpClient } from "@microsoft/sp-http";
import type { NICESPList } from "../../types";
import * as React from "react";
import { useState } from "react";
import useAudioFile from "../../../utils/hooks/useAudioFile";
import Pause from "../AudioItem/svgs/Pause";
import Skip from "../AudioItem/svgs/Skip";
import PlayIcon from "../PlayIcon";
import Volume2Icon from "../Volume2Icon";

export type TAudioItem = {
  absoluteUrl: string;
  client: SPHttpClient;
  spListLink: string;
  item: NICESPList;
  index: number;
};

const NewAudioItem: React.FC<TAudioItem> = (audioItem) => {
  const { absoluteUrl, spListLink, client, item } = { ...audioItem };
  const [playing, setPlaying] = useState(false);
  const [timePlayed, setTimePlayed] = useState<number>(0);
  const [previousTimer, setPreviousTimer] = useState<number>(
    new Date().getTime()
  );
  const [sliderValue, setSliderValue] = useState<number>(0);
  const { AudioRef, audioFileState, error } = useAudioFile({
    absoluteUrl: absoluteUrl,
    Attachments: item.Attachments,
    client: client,
    ID: item.ID,
    spListLink: spListLink,
  });

  if (error !== "") {
    console.log(error);
  }

  const restart = () => {
    setTimePlayed(0);
    setPlaying(false);
    if (AudioRef.current) {
      AudioRef.current.pause();
      AudioRef.current.currentTime = 0;
    }
  };

  const play = () => {
    if (AudioRef.current) {
      try {
        AudioRef.current
          .play()
          .then(() => {
            setPlaying(true);
            const newD = new Date().getTime();
            setPreviousTimer(newD);
            AudioRef.current?.addEventListener("timeupdate", updateSlider);
          })
          .catch((e) => {
            console.log("error playing audio: ", e);
          });
      } catch (e) {
        console.log(e);
      }
    }
  };

  const pause = () => {
    if (AudioRef.current) {
      try {
        AudioRef.current.pause();
        AudioRef.current.removeEventListener("timeupdate", updateSlider);
      } catch (e) {
        console.log(e);
      } finally {
        const total = new Date().getTime() - previousTimer + timePlayed;
        setTimePlayed(total);
        setPlaying(false);
      }
    }
  };

  const updateSlider = () => {
    if (AudioRef.current) {
      const currentTime = AudioRef.current.currentTime;
      const duration = AudioRef.current.duration;
      const value = (currentTime / duration) * 100;
      setSliderValue(value);
    }
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(parseInt(event.target.value));
    if (AudioRef.current) {
      AudioRef.current.currentTime =
        (AudioRef.current.duration * parseInt(event.target.value)) / 100;
    }
  };

  return (
    <div className={styles.audioItemContainer}>
      <div className={styles.audioItem}>
        <div className={styles.audioItemIndex}>{item.ID}</div>
        <div className={styles.audioItemControls}>
          <button
            onClick={restart}
            disabled={!audioFileState}
            className={styles.controlButton}
          >
            <Skip />
          </button>
          {playing ? (
            <button
              onClick={pause}
              disabled={!audioFileState}
              className={styles.controlButton}
            >
              <Pause />
            </button>
          ) : (
            <button
              onClick={play}
              disabled={!audioFileState}
              className={styles.controlButton}
            >
              <PlayIcon />
            </button>
          )}
          <div className={styles.sliderContainer}>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              className={styles.slider}
              onChange={handleSliderChange}
            />
            <Volume2Icon className={styles.volumeIcon} />
          </div>
        </div>
        <audio
          id={`audioRef_${audioItem.index}`}
          ref={AudioRef}
          style={{ display: "none" }}
        />
      </div>
      {/* <Duration duration={duration} /> */}
    </div>
  );
};

export default NewAudioItem;
