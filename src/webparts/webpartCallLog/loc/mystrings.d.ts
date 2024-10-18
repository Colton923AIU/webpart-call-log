declare interface IWebpartCallLogWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppLocalEnvironmentOffice: string;
  AppLocalEnvironmentOutlook: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
  AppOfficeEnvironment: string;
  AppOutlookEnvironment: string;
  UnknownEnvironment: string;
  PropertyPaneSPListLink: string;
  SPListLinkLabel: string;
  Theme: string;
}

declare module "WebpartCallLogWebPartStrings" {
  const strings: IWebpartCallLogWebPartStrings;
  export = strings;
}
