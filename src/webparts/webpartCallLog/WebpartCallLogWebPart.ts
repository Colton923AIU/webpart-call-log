import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneChoiceGroup,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import * as strings from "WebpartCallLogWebPartStrings";
import WebpartCallLog from "./components/WebpartCallLog";
import { IWebpartCallLogProps } from "./components/IWebpartCallLogProps";

export default class WebpartCallLogWebPart extends BaseClientSideWebPart<IWebpartCallLogProps> {
  public render(): void {
    const element: React.ReactElement<IWebpartCallLogProps> =
      React.createElement(WebpartCallLog, {
        spListLink: this.properties.spListLink,
        absoluteUrl: this.context.pageContext.web.absoluteUrl,
        spHttpClient: this.context.spHttpClient,
      });

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return Promise.resolve();
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel,
                }),
                PropertyPaneTextField("spListLink", {
                  label: strings.SPListLinkLabel,
                }),
                // PropertyPaneCheckbox()
                PropertyPaneChoiceGroup("theme", {
                  label: strings.Theme,
                  options: [
                    {
                      key: "aiu-system",
                      text: "aiu-system",
                    },
                    {
                      key: "aiu",
                      text: "aiu",
                    },
                    {
                      key: "cal-southern",
                      text: "cal-southern",
                    },
                    {
                      key: "default",
                      text: "default",
                    },
                  ],
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
