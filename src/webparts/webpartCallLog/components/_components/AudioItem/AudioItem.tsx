import * as React from "react";
import Pause from "./svgs/Pause";
import Skip from "./svgs/Skip";
import Play from "./svgs/Play";
import styles from "./AudioItem.module.scss";
import loadAudio from "./loadAudio/loadAudio";
import { SPHttpClient } from "@microsoft/sp-http";

export type TAudioItem = {
  id: string;
  absoluteUrl: string;
  client: SPHttpClient;
  spListLink: string;
  Attachments: boolean;
};

const AudioItem: ({
  id,
  absoluteUrl,
  spListLink,
  Attachments,
  client,
}: TAudioItem) => JSX.Element = ({
  id,
  absoluteUrl,
  spListLink,
  Attachments,
  client,
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
    setPlaying(true);
    setPreviousTimer(new Date().getTime());

    if (AudioRef.current) {
      // AudioRef.current.fastSeek(timePlayed);     obv need to do with pause functionality
      try {
        await AudioRef.current
          .play()
          .then(() => {
            console.log("playing, time played: ", timePlayed);
          })
          .catch((e) => {
            console.log("error playing audio: ", e);
          });
      } catch (e) {
        console.log(e);
        console.log("current ref: ", AudioRef);
      }
    }
  };
  const pause: () => void = () => {
    const total = new Date().getTime() - previousTimer + timePlayed;
    setTimePlayed(total);
    setPlaying(false);

    if (AudioRef.current) {
      try {
        console.log("paus         e");
        AudioRef.current.pause();
      } catch (e) {
        console.log("current ref: ", AudioRef);
        console.log(e);
      }
    }
  };

  React.useEffect(() => {
    const tryAudioFiling: () => Promise<boolean> = async () => {
      if (AudioRef.current) {
        const audioState = await loadAudio(
          {
            Attachments: Attachments,
            ID: id,
            Title: "",
          },
          AudioRef,
          absoluteUrl,
          spListLink,
          client
        );

        setAudioFileState(audioState);
        return true;
      } else {
        return false;
      }
    };
    tryAudioFiling()
      .then((val: boolean) => {
        console.log("did it work?: ", val);
      })
      .catch((e) => {
        console.log("e: ", e);
      });
  }, [AudioRef]);

  console.log("playing: ", playing);
  return (
    <div className={styles.controls}>
      <div className={styles.id}>{id}</div>
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
  );
};

export default AudioItem;
