import * as React from "react";
import type { IWebpartCallLogProps } from "./IWebpartCallLogProps";
import useSharePointListData from "../utils/hooks/useSharePointListData";
import { NICESPList } from "./types";
import styles from "./NewAudioItem.module.scss";
import NewAudioItem from "./_components/NewAudioItem";
import { TSPListData } from "../utils/hooks/useSharePointListData/useSharePointListData";

type TData = {
  name: string;
  calls: NICESPList[];
};

const WebpartCallLog: React.FC<IWebpartCallLogProps> = (
  props: IWebpartCallLogProps
) => {
  const { absoluteUrl, spHttpClient, spListLink } = {
    ...props,
  };
  const [filteredData, loading, error] = useSharePointListData({
    client: spHttpClient,
    absoluteUrl: absoluteUrl,
    spListLink: spListLink,
  });

  const SortedData: (data: NICESPList[]) => NICESPList[] = (
    filteredData: NICESPList[]
  ) => {
    return filteredData
      .sort((a: NICESPList, b: NICESPList) => {
        if (a.Tags) {
          if (b.Tags) {
            return a.Tags[0].charCodeAt(0) - b.Tags[0].charCodeAt(0);
          } else {
            return 0;
          }
        } else {
          return -1;
        }
      })
      .sort((a: NICESPList, b: NICESPList) => {
        if (a.CallType && b.CallType) {
          return a.CallType.charCodeAt(0) - b.CallType.charCodeAt(0);
        } else {
          return 0;
        }
      });
  };

  const CallTypes: (data: NICESPList[]) => Set<string> = (
    filteredData: NICESPList[]
  ) => {
    const callTypes: Set<string> = new Set();

    filteredData.forEach((item) => {
      if (item.CallType !== undefined) {
        callTypes.add(item.CallType);
      }
    });

    return callTypes;
  };

  const GenerateCalls: (filteredData: TSPListData) => TData[] = (
    filteredData: TSPListData
  ) => {
    const Calls: TData[] = [];

    CallTypes(filteredData).forEach((callType) => {
      const sortMe: NICESPList[] = [];
      filteredData.map((item, idx) => {
        if (item.CallType === callType) {
          sortMe.push(item);
        }
      });

      const calls = SortedData(sortMe);

      Calls.push({
        name: callType,
        calls: calls,
      });
    });
    return Calls;
  };

  const calls = GenerateCalls(filteredData);
  if (!loading && !error) {
    return (
      <section className={styles.sectionContainer}>
        <div className={styles.flexContainer}>
          <div>
            <h1
              style={{
                color: "#0063a7",
              }}
            >
              Call Library
            </h1>
          </div>
          <div className={styles.flexContainer}>
            {calls.map((callType) => {
              return (
                <div
                  key={"calltype_" + callType}
                  className={styles.flexContainer}
                >
                  <span className={styles.callType}>{callType.name}</span>
                  {callType.calls.map((call, index) => {
                    return (
                      <NewAudioItem
                        key={`new_audio_item_${index}`}
                        item={call}
                        absoluteUrl={absoluteUrl}
                        client={spHttpClient}
                        spListLink={spListLink}
                        index={index + 1}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  } else return null;
};

export default WebpartCallLog;
