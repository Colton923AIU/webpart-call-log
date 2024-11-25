import styles from "./NAudio.module.scss";
import type { SPHttpClient } from "@microsoft/sp-http";
import type { NICESPList } from "../../types";
import * as React from "react";
import { useState } from "react";
import useAudioFile from "../../../utils/hooks/useAudioFile";
import Pause from "../AudioItem/svgs/Pause";
import Skip from "../AudioItem/svgs/Skip";
import PlayIcon from "../PlayIcon";
import Duration from "./Duration";
import Tags from "./Tags";
import CurrentTime from "./CurrentTime";
// import Volume from "./Volume";
// import Volume2Icon from "../Volume2Icon";

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
  const [audioDuration, setAudioDuration] = useState<number>(0);
  // const [showVolumeSlider, setShowVolumeSlider] =
  //   React.useState<boolean>(false);

  const setDuration = (dur: number) => {
    setAudioDuration(dur);
    return;
  };
  const { AudioRef, audioFileState, error } = useAudioFile({
    absoluteUrl: absoluteUrl,
    item: item,
    client: client,
    spListLink: spListLink,
    setDuration: setDuration,
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

  const updateSlider = () => {
    if (AudioRef.current) {
      const currentTime = AudioRef.current.currentTime;
      const duration = AudioRef.current.duration;
      const value = (currentTime / duration) * 100;
      setSliderValue(value);
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

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(parseInt(event.target.value));
    if (AudioRef.current) {
      AudioRef.current.currentTime =
        (AudioRef.current.duration * parseInt(event.target.value)) / 100;
    }
  };

  // const toggleVolumeShowSlider = () => {
  //   setShowVolumeSlider(!showVolumeSlider);
  // };

  // const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (AudioRef.current) {
  //     AudioRef.current.volume = parseInt(e.target.value) / 100;
  //   }
  //   setTimeout(() => {
  //     if (showVolumeSlider === true) setShowVolumeSlider(false);
  //   }, 2000);
  // };

  const [currentTime, setCurrentTime] = React.useState(0);

  React.useEffect(() => {
    const audioElement = AudioRef?.current;
    if (!audioElement) return;

    const updateTime = () => {
      const currTime = audioElement.currentTime;
      setCurrentTime(currTime);
      if (currTime === audioDuration) {
        setTimeout(() => {
          pause();
        }, 1000);
      }
    };
    audioElement.addEventListener("timeupdate", updateTime);

    return () => {
      audioElement.removeEventListener("timeupdate", updateTime);
    };
  }, [AudioRef]);

  return (
    <div
      className={styles.audioItemContainer}
      id={`audio_item_container_${audioItem.index}`}
    >
      <div className={styles.audioItemIndex}>{audioItem.index}</div>
      <div className={styles.rightContainer}>
        <div className={styles.tagsWrapper}>
          {item.Tags ? <Tags tags={item.Tags} /> : null}
        </div>
        <div className={styles.audioItem}>
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
            </div>
            {/* <div className={styles.volumeFlex}>
            <button
              disabled={!audioFileState}
              className={styles.controlButton}
              onClick={toggleVolumeShowSlider}
            >
              <Volume2Icon className={styles.volumeIcon} />
            </button>
            {showVolumeSlider ? (
              <Volume handleChange={handleVolumeChange} />
            ) : null}
          </div> */}
            <div className={styles.time}>
              <CurrentTime audioCurrentTime={currentTime} />
              <span style={{ padding: "0 .1rem" }}>{`/`}</span>
              <Duration audioDuration={audioDuration} />
            </div>
          </div>
          <audio
            id={`audioRef_${audioItem.index}`}
            ref={AudioRef}
            style={{ display: "none" }}
          />
        </div>
      </div>
    </div>
  );
};

export default NewAudioItem;
