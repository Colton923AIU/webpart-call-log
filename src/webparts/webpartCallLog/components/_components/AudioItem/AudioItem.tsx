import * as React from "react";
import type { TAudioItem } from "../../WebpartCallLog";
import Pause from "./svgs/Pause";
import Skip from "./svgs/Skip";
import Play from "./svgs/Play";
import styles from "./AudioItem.module.scss";

const AudioItem: ({ audioFile, id }: TAudioItem) => JSX.Element = ({
  audioFile,
  id,
}: TAudioItem) => {
  const [playing, setPlaying] = React.useState<boolean>(false);
  const [timePlayed, setTimePlayed] = React.useState<number>(0);
  const [previousTimer, setPreviousTimer] = React.useState<number>(
    new Date().getTime()
  );
  const AudioRef = React.useRef<HTMLAudioElement | null>(null);

  const restart: () => void = () => {
    setTimePlayed(0);
    setPlaying(false);

    if (AudioRef.current) {
      AudioRef.current.fastSeek(0);
    }
  };

  const play: () => Promise<void> = async () => {
    setPlaying(true);
    setPreviousTimer(new Date().getTime());

    if (AudioRef.current) {
      AudioRef.current.fastSeek(timePlayed);
      try {
        await AudioRef.current
          .play()
          .then(() => {
            console.log("playing");
          })
          .catch(() => {
            console.log("error playing audio: ");
          });
      } catch (e) {
        console.log(e);
      }
    }
  };

  const pause: () => void = () => {
    const total = new Date().getTime() - previousTimer + timePlayed;
    setTimePlayed(total);
    setPlaying(false);

    if (AudioRef.current) {
      AudioRef.current.fastSeek(total);
    }
  };

  React.useEffect(() => {
    if (AudioRef.current) {
      AudioRef.current.src = "audioFile";
    }
  }, [AudioRef]);

  console.log("playing: ", playing);
  return (
    <div className={styles.controls}>
      <div className={styles.id}>{id}</div>
      <Skip onClick={restart} />
      {playing ? (
        <Pause onClick={pause} active={!playing} />
      ) : (
        <Play onClick={play} active={playing} />
      )}
      <audio ref={AudioRef} style={{ display: "none" }} />
    </div>
  );
};

export default AudioItem;
