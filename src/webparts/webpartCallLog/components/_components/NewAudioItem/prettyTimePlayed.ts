const prettyTimePlayed = (playtime: number) => {
  const played = Math.floor(playtime / 1000);
  if (played > 9) {
    return played.toFixed(0);
  } else {
    return `0${played}`;
  }
};

export default prettyTimePlayed;
