import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const INTRO_SRC = "/sapex-animation-copy.mp4";
const FADE_MS = 500;

let skipDocumentLoadIntro = false;

function consumeDocumentLoadIntro() {
  if (typeof window !== "undefined" && window.__SAPEX_INTRO_PLAYED_ON_LOAD) {
    skipDocumentLoadIntro = true;
    window.__SAPEX_INTRO_PLAYED_ON_LOAD = false;
  }
  return skipDocumentLoadIntro;
}

export default function IntroOverlay() {
  const { pathname } = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const finishingRef = useRef(false);
  const [fading, setFading] = useState(false);
  const [visible, setVisible] = useState(false);

  const finish = () => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    setFading(true);
    window.setTimeout(() => setVisible(false), FADE_MS);
  };

  useEffect(() => {
    consumeDocumentLoadIntro();

    if (pathname !== "/") {
      skipDocumentLoadIntro = false;
      finishingRef.current = false;
      setFading(false);
      setVisible(false);
      return;
    }

    if (skipDocumentLoadIntro) {
      setVisible(false);
      return;
    }

    setVisible(true);
  }, [pathname]);

  useEffect(() => {
    if (!visible) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const video = videoRef.current;
    if (video) {
      video.defaultPlaybackRate = 1;
      video.playbackRate = 1;
      const playAttempt = video.play();
      if (playAttempt) playAttempt.catch(() => finish());
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex h-dvh w-screen items-center justify-center bg-[#0A0D17] transition-opacity duration-500 ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        src={INTRO_SRC}
        className="h-full w-full object-cover"
        autoPlay
        muted
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        onEnded={finish}
        onError={finish}
        onLoadedMetadata={(event) => {
          event.currentTarget.defaultPlaybackRate = 1;
          event.currentTarget.playbackRate = 1;
        }}
      />
    </div>
  );
}
