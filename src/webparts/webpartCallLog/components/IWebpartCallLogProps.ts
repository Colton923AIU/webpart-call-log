import { SPHttpClient } from "@microsoft/sp-http";

export interface IWebpartCallLogProps {
  spListLink: string;
  absoluteUrl: string;
  spHttpClient: SPHttpClient;
}
