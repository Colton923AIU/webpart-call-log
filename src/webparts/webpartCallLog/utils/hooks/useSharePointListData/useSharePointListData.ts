import { SPHttpClient, type SPHttpClientResponse } from "@microsoft/sp-http";
import * as React from "react";
import urlGetByTitle from "../../urlGetByTitle";
import { NICESPList } from "../../../components/types";

export type TSPListData = Record<string, string | boolean>[];
export interface ISPListData {
  client: SPHttpClient; // SP Client for making fetch reqs
  spListLink: string;
  absoluteUrl: string;
}

/*
    Purpose: When a user copy and paste's their SP List,
    this hook will return access to the data via setState.
*/

const useSharePointListData: ({
  client,
  spListLink,
  absoluteUrl,
}: ISPListData) => [
  TSPListData,
  boolean,
  string,
  (selectedTags: string[]) => void
] = ({ spListLink, absoluteUrl, client }: ISPListData) => {
  const [listData, setListData] = React.useState<TSPListData>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [filteredData, setFilteredData] = React.useState<TSPListData>([]);

  const handleFilterChange = (selectedTags: string[]) => {
    if (selectedTags.length === 0) {
      setFilteredData(listData);
    } else {
      const filtered = listData.filter((item: NICESPList) => {
        if (item.Tags) {
          if (selectedTags.every((tag) => item.Tags?.indexOf(tag) !== -1)) {
            return true;
          }
        }
      });

      setFilteredData(filtered);
    }
  };

  const getSPListData: (url: string) => Promise<void> = async (url: string) => {
    if (!url) return;
    if (url.length < 3) return;
    try {
      const data = await client
        .get(url, SPHttpClient.configurations.v1)
        .then((response: SPHttpClientResponse) => {
          return response.json();
        });
      if (data) {
        const pre = data.value;
        const vals: any[] = [];
        pre.map((item: NICESPList) => {
          if (item.Approved === true && item.Attachments === true) {
            vals.push(item);
          }
        });
        setListData(vals);
        setFilteredData(vals);
        return;
      }
    } catch {
      setError("Response from SP List Getter Failed");
      return;
    }
  };

  React.useEffect(() => {
    const attempt: (attemptString: string) => void = async (attemptString) => {
      try {
        setLoading(true);
        await getSPListData(attemptString).then(() => {
          setLoading(false);
          return;
        });
      } catch {
        setLoading(false);
        setError("Error attempting to get sp list data");
      }
    };
    if (absoluteUrl && spListLink) {
      const url = urlGetByTitle({
        absoluteUrl: absoluteUrl,
        spListLink: spListLink,
      });
      if (url) {
        attempt(url + "/items");
      }
    }
  }, [spListLink, absoluteUrl]);

  return [filteredData, loading, error, handleFilterChange];
};

export default useSharePointListData;
