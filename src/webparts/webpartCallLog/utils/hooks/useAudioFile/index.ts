import { useState, useEffect, useRef } from "react";
import loadAudio from "../../../components/_components/AudioItem/loadAudio";
import { SPHttpClient } from "@microsoft/sp-http";

export type TAudioFileProps = {
  Attachments: boolean | undefined;
  ID: number | undefined;
  absoluteUrl: string;
  spListLink: string;
  client: SPHttpClient;
  StartCropTime?: number;
  EndCropTime?: number;
};

const useAudioFile = ({
  Attachments,
  ID,
  absoluteUrl,
  spListLink,
  client,
  StartCropTime,
  EndCropTime,
}: TAudioFileProps) => {
  const AudioRef = useRef<HTMLAudioElement | null>(null);
  const [audioFileState, setAudioFileState] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string>("");

  // const cropAudioBuffer = (
  //   audioBuffer: AudioBuffer,
  //   start: number,
  //   end: number
  // ) => {
  //   const sampleRate = audioBuffer.sampleRate;
  //   const startSample = Math.floor(start * sampleRate);
  //   const endSample = Math.floor(end * sampleRate);
  //   const frameCount = endSample - startSample;

  //   const croppedBuffer = new AudioBuffer({
  //     length: frameCount,
  //     numberOfChannels: audioBuffer.numberOfChannels,
  //     sampleRate: sampleRate,
  //   });

  //   for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
  //     const channelData = audioBuffer.getChannelData(channel);
  //     const croppedChannelData = croppedBuffer.getChannelData(channel);
  //     croppedChannelData.set(channelData.subarray(startSample, endSample));
  //   }

  //   return croppedBuffer;
  // };

  // const convertBufferToBlobUrl = async (audioBuffer: AudioBuffer) => {
  //   const context = new OfflineAudioContext(
  //     audioBuffer.numberOfChannels,
  //     audioBuffer.length,
  //     audioBuffer.sampleRate
  //   );
  //   const source = context.createBufferSource();
  //   source.buffer = audioBuffer;
  //   source.connect(context.destination);
  //   source.start();
  //   const renderedBuffer = await context.startRendering();
  //   const wavBlob = new Blob([renderedBuffer as unknown as BlobPart], {
  //     type: "audio/wav",
  //   });
  //   return URL.createObjectURL(wavBlob);
  // };

  useEffect(() => {
    setError("");

    const tryAudioFiling = async () => {
      try {
        const audioState = await loadAudio(
          {
            Attachments: Attachments ? Attachments : false,
            ID: ID ? ID.toString() : "0",
          },
          AudioRef,
          absoluteUrl,
          spListLink,
          client
        );

        setAudioFileState(audioState);
        if (AudioRef.current) {
          console.log("start", StartCropTime);
          console.log("end", EndCropTime);
          console.log("duration", AudioRef.current.duration);
          setDuration(AudioRef.current.duration);
        }
      } catch (e) {
        console.error("Error: useAudioFile hook error - ", e);
        setError("An error occurred while processing the audio file.");
      }
    };

    if (AudioRef.current && !audioFileState) {
      tryAudioFiling();
    } else {
      setError("Error: AudioRef is not current");
    }
  }, [AudioRef]);

  return { AudioRef, audioFileState, duration, error };
};

export default useAudioFile;
