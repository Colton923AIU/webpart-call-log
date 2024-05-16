const prettyTimePlayed = (playtime: number) => {
  const played = Math.floor(playtime / 1000);
  if (played > 59) {
    const m = Math.floor(played / 60);
    const s = played - m * 60;

    if (m > 9) {
      if (s > 9) {
        return `${m}:${s}`;
      } else {
        return `${m}:0${s}`;
      }
    } else {
      if (s > 9) {
        return `0${m}:${s}`;
      } else {
        return `0${m}:0${s}`;
      }
    }
  }
  if (played > 9) {
    return `00:${played.toFixed(0)}`;
  } else {
    return `00:0${played}`;
  }
};

export default prettyTimePlayed;
