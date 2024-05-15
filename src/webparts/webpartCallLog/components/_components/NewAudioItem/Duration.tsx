import * as React from "react";
import prettyTimePlayed from "./prettyTimePlayed";

const Duration = ({ audioDuration }: { audioDuration: number }) => {
  return <span>{prettyTimePlayed(audioDuration * 1000)}</span>;
};

export default Duration;
