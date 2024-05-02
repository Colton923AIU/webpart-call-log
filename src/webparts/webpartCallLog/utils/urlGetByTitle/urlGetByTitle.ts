const SPListLinkParser: (link: string) => string | undefined = (
  link: string
) => {
  const parsed = link;
  const parts = parsed.split("/")[parsed.split("/").indexOf("Lists") + 1];
  if (!parts) return undefined;
  return parts.replace(/%20/g, " ").split("?")[0];
};

const urlGetByTitle: ({
  absoluteUrl,
  spListLink,
}: {
  absoluteUrl: string;
  spListLink: string;
}) => string | undefined = ({ absoluteUrl, spListLink }) => {
  if (!absoluteUrl || !spListLink) return undefined;

  if (absoluteUrl.length < 3) {
    return undefined;
  }

  if (spListLink.length < 3) {
    return undefined;
  }

  const spLink = spListLink;
  const parsedLink = SPListLinkParser(spLink);

  if (!parsedLink) {
    return undefined;
  }

  const basePath = new URL(spListLink).origin;
  const subsites = spListLink.split("Lists")[0].split("com")[1];
  const url =
    basePath + subsites + `_api/web/lists/GetByTitle('${parsedLink}')`;

  return url;
};

export default urlGetByTitle;
