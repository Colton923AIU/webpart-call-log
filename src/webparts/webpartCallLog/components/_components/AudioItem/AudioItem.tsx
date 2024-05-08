import * as React from "react";
import Pause from "./svgs/Pause";
import Skip from "./svgs/Skip";
import Play from "./svgs/Play";
import styles from "./AudioItem.module.scss";
import loadAudio from "./loadAudio/loadAudio";
import { SPHttpClient } from "@microsoft/sp-http";
import { NICESPList } from "../../types";

export type TAudioItem = {
  absoluteUrl: string;
  client: SPHttpClient;
  spListLink: string;
  item: NICESPList;
};

const AudioItem: ({
  absoluteUrl,
  spListLink,
  client,
  item,
}: TAudioItem) => JSX.Element = ({
  absoluteUrl,
  spListLink,
  client,
  item,
}: TAudioItem) => {
  const [playing, setPlaying] = React.useState<boolean>(false);
  const [timePlayed, setTimePlayed] = React.useState<number>(0);
  const [previousTimer, setPreviousTimer] = React.useState<number>(
    new Date().getTime()
  );
  const [audioFileState, setAudioFileState] = React.useState<boolean>(false);
  const AudioRef = React.useRef<HTMLAudioElement | null>(null);

  const restart: () => void = () => {
    setTimePlayed(0);
    setPlaying(false);

    if (AudioRef.current) {
      AudioRef.current.pause();
      AudioRef.current.fastSeek(0);
    }
  };

  const play: () => Promise<void> = async () => {
    if (AudioRef.current) {
      try {
        await AudioRef.current
          .play()
          .then(() => {
            setPlaying(true);
            const newD = new Date().getTime();
            setPreviousTimer(newD);
          })
          .catch((e) => {
            console.log("error playing audio: ", e);
          });
      } catch (e) {
        console.log(e);
      }
    }
  };

  const pause: () => void = () => {
    if (AudioRef.current) {
      try {
        AudioRef.current.pause();
      } catch (e) {
        console.log(e);
      } finally {
        const total = new Date().getTime() - previousTimer + timePlayed;
        setTimePlayed(total);
        setPlaying(false);
      }
    }
  };

  React.useEffect(() => {
    const tryAudioFiling: () => Promise<boolean> = async () => {
      if (AudioRef.current) {
        const audioState = await loadAudio(
          {
            Attachments: item.Attachments ? item.Attachments : false,
            ID: item.ID ? item.ID.toString() : "0",
            Title: "",
          },
          AudioRef,
          absoluteUrl,
          spListLink,
          client
        );

        setAudioFileState(audioState);
        return audioState;
      } else {
        return false;
      }
    };
    tryAudioFiling()
      .then((val: boolean) => {
        if (val) {
          if (AudioRef.current) {
            AudioRef.current.currentTime = item.StartCropTime
              ? item.StartCropTime * 1000
              : 0;
          }
        }
      })
      .catch((e) => {
        console.log("e: ", e);
      });
  }, [AudioRef]);

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <p>{item.Title}</p>
        <Skip onClick={restart} disabled={audioFileState ? false : true} />
        {playing ? (
          <Pause
            onClick={() => pause()}
            active={!playing}
            disabled={audioFileState ? false : true}
          />
        ) : (
          <Play
            onClick={() => play()}
            active={playing}
            disabled={audioFileState ? false : true}
          />
        )}
        <audio id="audioRef" ref={AudioRef} style={{ display: "none" }} />
      </div>
    </div>
  );
};

export default AudioItem;
