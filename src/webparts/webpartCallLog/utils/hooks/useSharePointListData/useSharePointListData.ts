import { SPHttpClient, type SPHttpClientResponse } from "@microsoft/sp-http";
import * as React from "react";
import urlGetByTitle from "../../urlGetByTitle";

export type TSPListData = Record<string, string>;
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
}: ISPListData) => [TSPListData | undefined] = ({
  spListLink,
  absoluteUrl,
  client,
}: ISPListData) => {
  const [listData, setListData] = React.useState<TSPListData | null>(null);

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
        setListData(data.value);
        return;
      }
    } catch {
      console.log("Response from SP List Getter Failed");
      return;
    }
  };

  React.useEffect(() => {
    const attempt: (attemptString: string) => void = async (attemptString) => {
      try {
        await getSPListData(attemptString).then(() => {
          return;
        });
      } catch {
        console.log("Error attempting to get sp list data");
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

  if (listData) return [listData];
  else {
    return [undefined];
  }
};

export default useSharePointListData;
