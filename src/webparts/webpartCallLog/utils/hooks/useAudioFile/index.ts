import { useState, useEffect, useRef } from "react";
import { loadAudio } from "../../loadAudio";
import { SPHttpClient } from "@microsoft/sp-http";
import cropAudioBuffer from "../../cropAudioBuffer";
import convertBufferToBlobUrl from "../../convertBufferToBlobUrl";
import { NICESPList } from "../../../components/types";

export type TAudioFileProps = {
  item: NICESPList;
  absoluteUrl: string;
  spListLink: string;
  client: SPHttpClient;
  setDuration: (dur: number) => void;
};

const useAudioFile = ({
  absoluteUrl,
  spListLink,
  client,
  setDuration,
  item,
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
          numberOfChannels: 2,
          length: 1,
          sampleRate: 44100,
        });

        const response = await fetch(src);
        if (!response.ok) {
          throw new Error(`Failed to fetch audio file: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        if (
          item.CropServiceRequired &&
          item.StartCropTime &&
          item.EndCropTime &&
          !item.CropServiceCompleted
        ) {
          const croppedBuffer = cropAudioBuffer(
            audioBuffer,
            item.StartCropTime,
            item.EndCropTime
          );
          const newUrl = await convertBufferToBlobUrl(croppedBuffer);
          return newUrl;
        } else {
          const newUrl = await convertBufferToBlobUrl(audioBuffer);
          return newUrl;
        }
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
            Attachments: item.Attachments ? item.Attachments : false,
            ID: item.ID ? item.ID.toString() : "0",
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
            if (didUpdate !== "error") {
              const sourceElement = document.createElement("source");
              sourceElement.src = didUpdate;
              sourceElement.type = "audio/wav";

              AudioRef.current.innerHTML = "";
              AudioRef.current.appendChild(sourceElement);
              AudioRef.current.preload = "auto";

              AudioRef.current.onloadedmetadata = () => {
                setDuration(
                  AudioRef.current?.duration ? AudioRef.current?.duration : 0
                );
              };

              AudioRef.current.load();
              setAudioFileState(true);
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
