import * as React from "react";
import type { IWebpartCallLogProps } from "./IWebpartCallLogProps";
import styles from "./WebpartCallLog.module.scss";
import AudioItem from "./_components/AudioItem";
import useSharePointListData from "../utils/hooks/";
import { NICESPList } from "./types";

const WebpartCallLog: React.FC<IWebpartCallLogProps> = (
  props: IWebpartCallLogProps
) => {
  const { absoluteUrl, spHttpClient, spListLink, description } = { ...props };
  const [data, loading, error] = useSharePointListData({
    client: spHttpClient,
    absoluteUrl: absoluteUrl,
    spListLink: spListLink,
  });

  console.log("SP List Data: ", data);
  if (!loading && !error) {
    return (
      <section className={styles.wrapper}>
        <div className={styles.header}>
          <span>{description}</span>
        </div>
        <div className={`${styles.items} ${styles.scroll_y}`}>
          {data.map((item: NICESPList) => {
            return (
              <AudioItem
                item={item}
                absoluteUrl={absoluteUrl}
                client={spHttpClient}
                spListLink={spListLink}
              />
            );
          })}
        </div>
      </section>
    );
  } else return null;
};

export default WebpartCallLog;
