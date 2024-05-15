import { useState, useEffect, useRef } from "react";
import { loadAudio } from "../../loadAudio";
import { SPHttpClient } from "@microsoft/sp-http";
import cropAudioBuffer from "../../cropAudioBuffer";
import convertBufferToBlobUrl from "../../convertBufferToBlobUrl";

export type TAudioFileProps = {
  Attachments: boolean | undefined;
  ID: number | undefined;
  absoluteUrl: string;
  spListLink: string;
  client: SPHttpClient;
};

const useAudioFile = ({
  Attachments,
  ID,
  absoluteUrl,
  spListLink,
  client,
}: TAudioFileProps) => {
  const AudioRef = useRef<HTMLAudioElement | null>(null);
  const [audioFileState, setAudioFileState] = useState(false);
  const [error, setError] = useState<string>("");
  useEffect(() => {
    setError("");

    const updateAudioFile = async (src: string) => {
      if (!AudioRef.current) {
        setError("Error: AudioRef is not current");
        return "error";
      }

      try {
        const audioContext = new OfflineAudioContext({
          numberOfChannels: 2, // Assuming stereo audio
          length: 1, // Dummy length (to be updated)
          sampleRate: 44100, // Sample rate of the audio (adjust as needed)
        });

        // Fetch the audio data as a Blob
        const response = await fetch(src);
        if (!response.ok) {
          throw new Error(`Failed to fetch audio file: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        // Now you have the audio buffer, you can crop it or do any other manipulation
        const croppedBuffer = cropAudioBuffer(audioBuffer, 1, 10);
        const newUrl = await convertBufferToBlobUrl(croppedBuffer);

        return newUrl;
      } catch (e) {
        console.error("Error altering audio state", e);
        setError(`Error altering audio state: ${e.message}`);
        return "error";
      }
    };

    const attachAudio = async () => {
      try {
        const audioState = await loadAudio(
          {
            Attachments: Attachments ? Attachments : false,
            ID: ID ? ID.toString() : "0",
          },
          absoluteUrl,
          spListLink,
          client
        );

        if (audioFileState === false) {
          setAudioFileState(false);
        } else {
          setAudioFileState(true);
        }
        return audioState;
      } catch (e) {
        console.error("Error: useAudioFile hook error - ", e);
        setError("An error occurred while processing the audio file.");
        return false;
      }
    };

    const initializeAudio = async () => {
      if (AudioRef.current && !audioFileState) {
        const audioState = await attachAudio();
        if (audioState !== false) {
          if (audioState !== true) {
            const didUpdate = await updateAudioFile(audioState);
            console.log("didUpdate: ", didUpdate);
            if (didUpdate !== "error") {
              AudioRef.current.src = didUpdate;
              AudioRef.current.preload = "auto";
              AudioRef.current.load();
            }
          }
        }
      }
    };

    initializeAudio();
  }, [AudioRef]);

  return { AudioRef, audioFileState, error };
};

export default useAudioFile;
