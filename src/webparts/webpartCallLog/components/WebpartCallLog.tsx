import * as React from "react";
import type { IWebpartCallLogProps } from "./IWebpartCallLogProps";
import styles from "./WebpartCallLog.module.scss";
import AudioItem from "./_components/AudioItem";
import useSharePointListData from "../utils/hooks/";

const WebpartCallLog: React.FC<IWebpartCallLogProps> = (
  props: IWebpartCallLogProps
) => {
  const { absoluteUrl, spHttpClient, spListLink } = { ...props };
  const [data, loading, error] = useSharePointListData({
    client: spHttpClient,
    absoluteUrl: absoluteUrl,
    spListLink: spListLink,
  });

  console.log("loading: ", loading);
  console.log("error: ", error);
  console.log("data: ", data);
  if (!loading && !error) {
    return (
      <section className={styles.wrapper}>
        <div className={styles.header}>
          <span>audio log</span>
        </div>
        <div className={`${styles.items} ${styles.scroll_y}`}>
          {data.map((item) => {
            return (
              <AudioItem
                key={item.ID.toString()}
                id={item.ID.toString()}
                Attachments={item.Attachments as boolean}
                absoluteUrl={absoluteUrl}
                client={spHttpClient}
                spListLink={spListLink}
              />
            );
          })}
        </div>
      </section>
    );
  } else {
    return (
      <>
        loading:
        {loading}
        error:
        {error}
      </>
    );
  }
};

export default WebpartCallLog;
