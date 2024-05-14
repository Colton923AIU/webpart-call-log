import * as React from "react";
import type { IWebpartCallLogProps } from "./IWebpartCallLogProps";
import useSharePointListData from "../utils/hooks/";
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
          {data.map((item: NICESPList) => {
            return (
              <NewAudioItem
                item={item}
                absoluteUrl={absoluteUrl}
                client={spHttpClient}
                spListLink={spListLink}
              />
            );
          })}
        </CallLogComponent>
      </section>
    );
  } else return null;
};

export default WebpartCallLog;
