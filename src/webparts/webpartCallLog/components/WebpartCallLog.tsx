import * as React from "react";
import type { IWebpartCallLogProps } from "./IWebpartCallLogProps";
import useSharePointListData from "../utils/hooks/useSharePointListData";
import { NICESPList } from "./types";
import CallLogComponent from "./_components/CallLogComponent";
import NewAudioItem from "./_components/NewAudioItem";

const WebpartCallLog: React.FC<IWebpartCallLogProps> = (
  props: IWebpartCallLogProps
) => {
  const { absoluteUrl, spHttpClient, spListLink, description } = { ...props };
  const [data, loading, error] = useSharePointListData({
    client: spHttpClient,
    absoluteUrl: absoluteUrl,
    spListLink: spListLink,
  });

  if (!loading && !error) {
    return (
      <section>
        <CallLogComponent description={description}>
          {data.map((item: NICESPList, index: number) => {
            return (
              <NewAudioItem
                item={item}
                absoluteUrl={absoluteUrl}
                client={spHttpClient}
                spListLink={spListLink}
                index={index}
              />
            );
          })}
        </CallLogComponent>
      </section>
    );
  } else return null;
};

export default WebpartCallLog;
