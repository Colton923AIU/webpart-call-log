import { SPHttpClient, type SPHttpClientResponse } from "@microsoft/sp-http";
import * as React from "react";
import urlGetByTitle from "../../urlGetByTitle";

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
}: ISPListData) => [TSPListData, boolean, string] = ({
  spListLink,
  absoluteUrl,
  client,
}: ISPListData) => {
  const [listData, setListData] = React.useState<TSPListData>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

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

  return [listData, loading, error];
};

export default useSharePointListData;
