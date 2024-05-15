const cropAudioBuffer = (
  audioBuffer: AudioBuffer,
  start: number,
  end: number
) => {
  const sampleRate = audioBuffer.sampleRate;
  const startSample = Math.floor(start * sampleRate);
  const endSample = Math.floor(end * sampleRate);
  const frameCount = endSample - startSample;

  const croppedBuffer = new AudioBuffer({
    length: frameCount,
    numberOfChannels: audioBuffer.numberOfChannels,
    sampleRate: sampleRate,
  });

  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel);
    const croppedChannelData = croppedBuffer.getChannelData(channel);
    croppedChannelData.set(channelData.subarray(startSample, endSample));
  }

  return croppedBuffer;
};
export default cropAudioBuffer;
