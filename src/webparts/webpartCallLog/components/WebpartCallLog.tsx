import * as React from "react";
import type { IWebpartCallLogProps } from "./IWebpartCallLogProps";
import useSharePointListData from "../utils/hooks/useSharePointListData";
import { NICESPList } from "./types";
import CallLogComponent from "./_components/CallLogComponent";
import NewAudioItem from "./_components/NewAudioItem";
import FilterController from "./_components/FilterController/FilterController";
import { TSPListData } from "../utils/hooks/useSharePointListData/useSharePointListData";

const WebpartCallLog: React.FC<IWebpartCallLogProps> = (
  props: IWebpartCallLogProps
) => {
  const { absoluteUrl, spHttpClient, spListLink, description } = { ...props };
  const [data, loading, error] = useSharePointListData({
    client: spHttpClient,
    absoluteUrl: absoluteUrl,
    spListLink: spListLink,
  });
  const [filteredData, setFilteredData] = React.useState<TSPListData | null>(
    null
  );

  const handleFilterChange = (selectedTags: string[]) => {
    if (selectedTags.length === 0) {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item: NICESPList) =>
        selectedTags.every((tag) => item.Tags?.indexOf(tag) !== -1)
      );
      setFilteredData(filtered);
    }
  };

  React.useEffect(() => {
    if (data) {
      setFilteredData(data);
    }
  }, [data]);

  if (!filteredData) return null;
  if (!loading) return null;
  if (!error) return null;
  return (
    <section>
      <CallLogComponent description={description}>
        <FilterController data={data} onFilterChange={handleFilterChange} />
        {filteredData.map((item: NICESPList, index: number) => {
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
};

export default WebpartCallLog;
