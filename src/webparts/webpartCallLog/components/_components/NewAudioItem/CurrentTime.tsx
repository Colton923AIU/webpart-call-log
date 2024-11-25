import * as React from "react";
import prettyTimePlayed from "./prettyTimePlayed";

const CurrentTime = ({ audioCurrentTime }: { audioCurrentTime: number }) => {
  return <span>{prettyTimePlayed(audioCurrentTime * 1000)}</span>;
};

export default CurrentTime;
