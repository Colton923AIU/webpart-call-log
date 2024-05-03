import { SPHttpClient } from "@microsoft/sp-http";
import * as React from "react";
import urlGetByTitle from "../../../../utils/urlGetByTitle";

type SPListDefaultKeys = "Title" | "Attachments" | "ID";
type TSPListWithAudio = Record<SPListDefaultKeys, string | boolean>;

const attachAudio: (
  testUrl: string,
  ref: React.RefObject<HTMLAudioElement>,
  client: SPHttpClient
) => Promise<boolean> = async (
  testUrl: string,
  ref: React.RefObject<HTMLAudioElement>,
  client: SPHttpClient
) => {
  try {
    const fileResponse = await client.get(
      testUrl,
      SPHttpClient.configurations.v1
    );
    const file = await fileResponse.json();
    if (file && file.value && file.value.length > 0) {
      const firstFile = file.value[0];
      const fileName = firstFile.FileName;
      const fileUrl = `${testUrl.slice(0, -1)}('${fileName}')/$value`;

      if (ref.current) {
        ref.current.src = fileUrl;
        ref.current.preload = "auto";
        ref.current.load();
      }
    }
    console.log("Success getting audio:");
    return true;
  } catch (error) {
    console.log("Failed getting audio:", error);
    return false;
  }
};

const loadAudio: (
  listWithAudioAttachments: TSPListWithAudio,
  ref: React.RefObject<HTMLAudioElement>,
  absoluteUrl: string,
  spListLink: string,
  client: SPHttpClient
) => Promise<boolean> = async (
  listWithAudioAttachments: TSPListWithAudio,
  ref: React.RefObject<HTMLAudioElement>,
  absoluteUrl: string,
  spListLink: string,
  client: SPHttpClient
) => {
  let success = true;
  try {
    if (listWithAudioAttachments.Attachments === true) {
      const url = urlGetByTitle({
        absoluteUrl: absoluteUrl,
        spListLink: spListLink,
      });
      if (url) {
        const thisItem =
          url + `/items(${listWithAudioAttachments.ID})/AttachmentFiles/`;

        try {
          await attachAudio(thisItem, ref, client);
        } catch (error) {
          console.log("Failed:", error);
          success = false;
        }
      } else {
        success = false;
      }
    }
    return success;
  } catch {
    success = false;
    return success;
  }
};

export default loadAudio;
