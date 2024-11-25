import * as React from "react";
import type { IWebpartCallLogProps } from "./IWebpartCallLogProps";
import useSharePointListData from "../utils/hooks/useSharePointListData";
import { NICESPList } from "./types";
import styles from "./NewAudioItem.module.scss";
import NewAudioItem from "./_components/NewAudioItem";
// import FilterController from "./_components/FilterController/FilterController";

type PossibleThemes = "aiu-system" | "aiu" | "cal-southern" | "default";

const WebpartCallLog: React.FC<IWebpartCallLogProps> = (
  props: IWebpartCallLogProps
) => {
  const { absoluteUrl, spHttpClient, spListLink, description, theme } = {
    ...props,
  };
  const [filteredData, loading, error] = useSharePointListData({
    client: spHttpClient,
    absoluteUrl: absoluteUrl,
    spListLink: spListLink,
  });
  const [themeClassList, setThemeClassList] =
    React.useState<PossibleThemes>("default");
  React.useEffect(() => {
    if (theme === "aiu-system") {
      setThemeClassList("aiu-system");
    }
    if (theme === "aiu") {
      setThemeClassList("aiu");
    }
    if (theme === "cal-southern") {
      setThemeClassList("cal-southern");
    }
    if (theme === "default") {
      setThemeClassList("default");
    }
  }, [theme]);
  const SortedData = (filteredData: NICESPList[]) => {
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
        return 0;
      })
      .sort((a: NICESPList, b: NICESPList) => {
        if (a.CallType && b.CallType) {
          return a.CallType.charCodeAt(0) - b.CallType.charCodeAt(0);
        } else {
          return 0;
        }
      });
  };
  const CallTypes = (filteredData: NICESPList[]) => {
    let callTypes: string[] = [];
    filteredData.map((item) => {
      if (item.CallType) {
        if (
          callTypes.every((val) => {
            val !== item;
          })
        ) {
          callTypes.push(item.CallType);
        }
      }
    });
    return callTypes;
  };

  if (!loading && !error) {
    return (
      <section className={styles.sectionContainer && styles[themeClassList]}>
        <div className={styles.flexContainer}>
          <div className={styles.flexHeader}>
            <h1 className={styles.heading}>{description}</h1>
            {/* <FilterController
              data={filteredData}
              onFilterChange={handleFilterChange}
            /> */}
          </div>
          <div className={styles.flexContainer}>
            {CallTypes(filteredData).map((type) => {
              return (
                <div className={styles.flexContainer}>
                  <span className={styles.callType}>{type}</span>
                  {SortedData(filteredData).map(
                    (item: NICESPList, index: number) => {
                      return (
                        <NewAudioItem
                          key={`new_audio_item_${index}`}
                          item={item}
                          absoluteUrl={absoluteUrl}
                          client={spHttpClient}
                          spListLink={spListLink}
                          index={index + 1}
                        />
                      );
                    }
                  )}
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
