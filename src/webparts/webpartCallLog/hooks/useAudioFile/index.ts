import { useState, useEffect } from "react";
import type { MutableRefObject } from "react";
import loadAudio from "../../components/_components/AudioItem/loadAudio";
import { SPHttpClient } from "@microsoft/sp-http";

export type TAudioFileProps = {
  AudioRef: MutableRefObject<HTMLAudioElement | null>;
  Attachments: boolean | undefined;
  ID: number | undefined;
  absoluteUrl: string;
  spListLink: string;
  client: SPHttpClient;
  StartCropTime?: number;
  EndCropTime?: number;
};

const useAudioFile: (
  props: TAudioFileProps
) => [boolean, number, null | string] = ({
  AudioRef,
  Attachments,
  ID,
  absoluteUrl,
  spListLink,
  client,
  StartCropTime,
  EndCropTime,
}: TAudioFileProps) => {
  const [audioFileState, setAudioFileState] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<null | string>(null);

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

  const convertBufferToBlobUrl = async (audioBuffer: AudioBuffer) => {
    const context = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );
    const source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(context.destination);
    source.start();
    const renderedBuffer = await context.startRendering();
    const wavBlob = new Blob([renderedBuffer as unknown as BlobPart], {
      type: "audio/wav",
    });
    return URL.createObjectURL(wavBlob);
  };

  useEffect(() => {
    console.log("executing effect");
    if (!AudioRef.current) {
      console.log("ending effect early");
      return;
    }
    console.log("continue");

    const tryAudioFiling = async () => {
      if (AudioRef.current) {
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

        console.log("try audio filing: ", audioState);

        console.log("audioref.current: ", AudioRef.current);
        if (AudioRef.current) {
          const audioContext = new (window.AudioContext ||
            window.AudioContext)();
          const response = await fetch(AudioRef.current.src);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

          const start = StartCropTime ? StartCropTime : 0;
          const end = EndCropTime ? EndCropTime : audioBuffer.duration;
          const croppedBuffer = cropAudioBuffer(audioBuffer, start, end);
          const croppedUrl = await convertBufferToBlobUrl(croppedBuffer);

          AudioRef.current.src = croppedUrl;
        }

        return audioState;
      } else {
        setError("tryAudioFiling failed");
        return false;
      }
    };
    try {
      tryAudioFiling()
        .then((state) => {
          console.log("state: ", state);
          setAudioFileState(state);
          setDuration(
            AudioRef.current?.duration ? AudioRef.current?.duration : 0
          );
        })
        .catch((e) => {
          console.log("Error: useAudioFile hook error - ", e);
        });
    } catch (e) {
      console.log("error calling function: ", e);
    }
  }, [AudioRef]);

  return [audioFileState, duration, error];
};

export default useAudioFile;
