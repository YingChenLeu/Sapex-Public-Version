import { useEffect, useState } from "react";

/**
 * Drives a scene index that cycles through `count` values, advancing every
 * `durations[index]` milliseconds. Pauses (stays on first scene) when
 * `paused` is true (e.g. for prefers-reduced-motion).
 */
export function useSceneLoop(durations: number[], paused = false) {
  const [scene, setScene] = useState(0);

  useEffect(() => {
    if (paused) return;
    const wait = durations[scene] ?? 3000;
    const t = window.setTimeout(() => {
      setScene((s) => (s + 1) % durations.length);
    }, wait);
    return () => window.clearTimeout(t);
  }, [scene, paused, durations]);

  return scene;
}
