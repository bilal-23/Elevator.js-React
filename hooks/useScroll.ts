import { useState, useEffect, useCallback, useRef } from "react";

import mainAudio from "@/assets/music/elevator.mp3";
import endAudio from "@/assets/music/ding.mp3";

// Define the interface for the hook's options to ensure type safety for the parameters.
interface UseElevatorOptions {
  targetElement?: string; // The id of element to scroll to.
  duration?: number; // Duration of the scroll animation.
  mainAudioUrl?: string; // URL of the audio to play during scroll.
  endAudioUrl?: string; // URL of the audio to play once scrolling finishes.
  audio?: boolean; // Whether to play audio during the scroll.
  verticalPadding?: number; // Padding from the target element to stop above it.
  startCallback?: () => void; // Callback function to execute when scrolling starts.
  endCallback?: () => void; // Callback function to execute when scrolling ends.
}

// Easing function for the scrolling animation, providing a smooth transition.
const easeInOutQuad = (t: number, b: number, c: number, d: number): number => {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t + b;
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
};

// The useElevator hook encapsulates the logic for a smooth scrolling effect, optionally with audio and callbacks.
export const useElevator = ({
  targetElement,
  duration: customDuration = 0,
  mainAudioUrl,
  endAudioUrl,
  audio = true,
  verticalPadding = 0,
  startCallback,
  endCallback,
}: UseElevatorOptions) => {
  const [isElevating, setIsElevating] = useState<boolean>(false); // State to manage if the elevator effect is active.
  const animationFrameRef = useRef<number>(); // Ref to store the requestAnimationFrame ID for cancellation.
  const mainAudioRef = useRef<HTMLAudioElement | null>(new Audio(mainAudio)); // Refs for the audio elements to control playback.
  const customDurationRef = useRef<number>(customDuration); // Ref to store the custom duration.
  const endAudioRef = useRef<HTMLAudioElement | null>(new Audio(endAudio));
  const startPositionRef = useRef<number | null>(null); // Ref to store the initial scroll position.
  const endPositionRef = useRef<number | null>(null); // Ref to store the target scroll position.
  const startTimeRef = useRef<number | null>(null); // Ref to store the animation start time.

  // Effect to initialize audio elements based on provided URLs.
  useEffect(() => {
    if (mainAudioUrl) {
      console.log(mainAudioUrl);
      mainAudioRef.current = new Audio(mainAudioUrl);
    }
    if (endAudioUrl) {
      endAudioRef.current = new Audio(endAudioUrl);
    }
  }, [mainAudioUrl, endAudioUrl]);

  // Effect to skip the animation when window is blurred, and pause audio if playing.
  useEffect(() => {
    window.addEventListener("blur", () => {
      if (isElevating) {
        cancelAnimationFrame(animationFrameRef.current!);
        startTimeRef.current = null;
        startPositionRef.current = null;
        setIsElevating(false);
      }
      if (mainAudioRef.current) {
        mainAudioRef.current.pause();
      }
      window.scrollTo(0, endPositionRef.current!);
    });

    return () => {
      window.removeEventListener("blur", () => {});
    };
  }, [isElevating]);

  // Cleanup effect to pause and reset audio, and cancel the animation frame when the component unmounts or the effect re-runs.
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      mainAudioRef.current?.pause();
      endAudioRef.current?.pause();
    };
  }, []);

  // Function to update the end position based on the target element and any vertical padding.
  const updateEndPosition = useCallback(() => {
    if (targetElement) {
      let element: HTMLElement | null = document.getElementById(targetElement);
      let verticalOffset = 0;
      while (element) {
        verticalOffset += element.offsetTop || 0;
        element = element.offsetParent as HTMLElement | null;
      }
      endPositionRef.current = verticalOffset - verticalPadding;
    } else {
      endPositionRef.current = 0 + verticalPadding; // Default to the top of the document. + padding if any
    }
  }, [targetElement, verticalPadding]);

  // The core function to perform the scroll animation.
  const animateScroll = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const runtime = timestamp - startTimeRef.current;
      const duration =
        customDurationRef.current ||
        Math.abs(endPositionRef.current! - startPositionRef.current!) * 1.5;
      const progress = easeInOutQuad(
        runtime,
        startPositionRef.current!,
        endPositionRef.current! - startPositionRef.current!,
        duration,
      );
      window.scrollTo(0, progress); // Perform the actual scroll.

      // Continue the animation until the duration is met.
      if (runtime < duration) {
        animationFrameRef.current = requestAnimationFrame(animateScroll);
      } else {
        // Once finished, play the end audio, execute the callback, and reset state.
        if (audio) {
          endAudioRef.current?.play();
          mainAudioRef.current?.pause();
        }
        endCallback?.();
        startTimeRef.current = null;
        startPositionRef.current = null;
        setIsElevating(false);
      }
    },
    [audio, endCallback],
  );

  // Function to initiate the scrolling effect.
  const startElevating = useCallback(() => {
    if (isElevating) return; // Prevent starting a new animation if one is already active.
    if (audio) {
      mainAudioRef.current?.play(); // Start the main audio if provided.
    }
    setIsElevating(true);
    updateEndPosition(); // Calculate the target scroll position.
    startPositionRef.current = window.scrollY; // Capture the starting position.
    startTimeRef.current = 0;
    startCallback?.(); // Execute the start callback if provided.

    animationFrameRef.current = requestAnimationFrame(animateScroll); // Begin the animation.
  }, [animateScroll, audio, isElevating, startCallback, updateEndPosition]);

  // Expose the startElevating function and the isElevating state to the components using this hook.
  return { startElevating, isElevating };
};
