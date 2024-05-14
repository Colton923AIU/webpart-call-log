import { SPHttpClient } from "@microsoft/sp-http";
import * as React from "react";
import urlGetByTitle from "../../../../utils/urlGetByTitle";

type SPListDefaultKeys = "Attachments" | "ID";
type TSPListWithAudio = Record<SPListDefaultKeys, string | boolean>;

const attachAudio = async (
  testUrl: string,
  ref: React.RefObject<HTMLAudioElement>,
  client: SPHttpClient
): Promise<boolean> => {
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
      console.log("Audio file successfully attached:", fileUrl);
      return true;
    } else {
      console.log("No audio file found at:", testUrl);
      return false;
    }
  } catch (error) {
    console.error("Error fetching audio file:", error);
    return false;
  }
};

const loadAudio = async (
  listWithAudioAttachments: TSPListWithAudio,
  ref: React.RefObject<HTMLAudioElement>,
  absoluteUrl: string,
  spListLink: string,
  client: SPHttpClient
): Promise<boolean> => {
  if (!listWithAudioAttachments.Attachments) {
    console.log("No attachments found for item:", listWithAudioAttachments.ID);
    return false;
  }

  const url = urlGetByTitle({ absoluteUrl, spListLink });
  if (!url) {
    console.error("Failed to construct URL for SharePoint list");
    return false;
  }

  const thisItem = `${url}/items(${listWithAudioAttachments.ID})/AttachmentFiles/`;
  return attachAudio(thisItem, ref, client);
};

export default loadAudio;
