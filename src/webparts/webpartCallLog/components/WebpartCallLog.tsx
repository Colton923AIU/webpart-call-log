import * as React from "react";
import type { IWebpartCallLogProps } from "./IWebpartCallLogProps";
import styles from "./WebpartCallLog.module.scss";
import AudioItem from "./_components/AudioItem";
import useSharePointListData from "../utils/hooks/";

export type TAudioItem = {
  id: string;
  audioFile: Blob;
};

const WebpartCallLog: React.FC<IWebpartCallLogProps> = (
  props: IWebpartCallLogProps
) => {
  const { absoluteUrl, spHttpClient, spListLink } = { ...props };
  const [data] = useSharePointListData({
    client: spHttpClient,
    absoluteUrl: absoluteUrl,
    spListLink: spListLink,
  });
  console.log("data: ", data);

  const TestItems: TAudioItem[] = [
    {
      id: "a34a",
      audioFile: new Blob(),
    },
    {
      id: "b34b",
      audioFile: new Blob(),
    },
    {
      id: "a34a",
      audioFile: new Blob(),
    },
    {
      id: "b34b",
      audioFile: new Blob(),
    },
    {
      id: "a34a",
      audioFile: new Blob(),
    },
    {
      id: "b34b",
      audioFile: new Blob(),
    },
    {
      id: "a34a",
      audioFile: new Blob(),
    },
    {
      id: "b34b",
      audioFile: new Blob(),
    },
    {
      id: "a34a",
      audioFile: new Blob(),
    },
    {
      id: "b34b",
      audioFile: new Blob(),
    },
  ];

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <span>audio log</span>
      </div>
      <div className={`${styles.items} ${styles.scroll_y}`}>
        {TestItems.map((audioItem, index) => {
          return (
            <AudioItem
              key={index}
              audioFile={audioItem.audioFile}
              id={audioItem.id}
            />
          );
        })}
      </div>
    </section>
  );
};

export default WebpartCallLog;
