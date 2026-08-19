import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { Pause, Play, TextAlignStart } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider.jsx";

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

  const safeSeconds = Math.floor(seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function buildWaveBars(progress) {
  return Array.from({ length: 34 }, (_, index) => {
    const base = 12 + ((index * 7) % 18);
    const isActive = progress > 0 && index / 34 < progress;
    return { height: base, isActive };
  });
}

export default function VoiceReviewPhone({
  audioUrl,
  transcript,
  customerName,
  city,
  isActive = true,
}) {
  const { t, language } = useI18n();
  const audioRef = useRef(null);
  const cardRef = useRef(null);
  const detailsRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const transcriptText = transcript?.[language] ?? transcript?.uz ?? "";

  useLayoutEffect(() => {
    const card = cardRef.current;
    const details = detailsRef.current;
    if (!card || !details) return undefined;

    const detailsHeight = isExpanded ? details.scrollHeight : 0;
    const expandedCardHeight = 92 + 8 + detailsHeight + 16;

    gsap.killTweensOf([card, details]);
    gsap.to(card, {
      height: isExpanded ? expandedCardHeight : 92,
      duration: 0.5,
      ease: "power3.out",
      overwrite: true,
    });
    gsap.to(details, {
      maxHeight: detailsHeight,
      marginTop: isExpanded ? 8 : 0,
      opacity: isExpanded ? 1 : 0,
      y: isExpanded ? 0 : -6,
      duration: 0.28,
      ease: "power2.out",
      overwrite: true,
    });

    return () => {
      gsap.killTweensOf([card, details]);
    };
  }, [isExpanded, transcriptText]);

  useEffect(() => {
    if (!isActive) setIsExpanded(false);
  }, [isActive]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || isActive) return;

    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  }, [isActive]);

  const messageClock = useMemo(() => {
    const now = new Date();

    return new Intl.DateTimeFormat(
      language === "ru" ? "ru-RU" : language === "en" ? "en-GB" : "uz-UZ",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      },
    ).format(now);
  }, [language]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    audio.pause();
    audio.currentTime = 0;
    audio.load();
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    const syncDuration = () => {
      if (Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const syncCurrentTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(audio.duration || 0);
    };

    audio.addEventListener("loadedmetadata", syncDuration);
    audio.addEventListener("durationchange", syncDuration);
    audio.addEventListener("timeupdate", syncCurrentTime);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    syncDuration();
    syncCurrentTime();

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", syncDuration);
      audio.removeEventListener("durationchange", syncDuration);
      audio.removeEventListener("timeupdate", syncCurrentTime);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioUrl]);

  const handleTogglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.ended) {
      audio.currentTime = 0;
    }

    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    audio.pause();
  };

  const handleSeek = (event) => {
    const audio = audioRef.current;
    if (!audio) return;

    const nextTime = Number(event.target.value);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const progress = duration > 0 ? currentTime / duration : 0;
  const waveBars = useMemo(() => buildWaveBars(progress), [progress]);

  return (
    <article
      ref={cardRef}
      className="relative flex h-[92px] w-[303px] min-w-[303px] max-w-[303px] shrink-0 flex-col overflow-hidden rounded-[12px] bg-[#FBFBFB] p-2 font-sans text-[#171717]"
      aria-label={`${customerName} voice review`}
    >
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="m-0 text-[14px] font-medium leading-[1.1]">
            {customerName}
          </p>
          <p className="m-0 mt-0.5 text-[12px] leading-none text-[#929292]">
            {city}
          </p>
        </div>
      </div>

      <div className="pt-2 flex items-center gap-2">
        <button
          type="button"
          className="grid h-10 w-10 flex-none cursor-pointer place-items-center rounded-full border-0 bg-[#111] pl-px text-white"
          onClick={handleTogglePlayback}
          aria-label={
            isPlaying ? t("reviews.voice.pause") : t("reviews.voice.play")
          }
        >
          {isPlaying ? (
            <Pause size={18} strokeWidth={2.8} />
          ) : (
            <Play size={17} strokeWidth={2.8} fill="currentColor" />
          )}
        </button>
        <div className="relative h-5 min-w-0 flex-1 -translate-y-2">
          <div className="flex h-5 items-center justify-between overflow-hidden">
            {waveBars.map((bar, index) => (
              <span
                key={index}
                className={`w-0.5 min-h-[2px] rounded-full transition-colors duration-200 ${bar.isActive ? "bg-[#aaa]" : "bg-[#d2d2d2]"}`}
                style={{ height: `${bar.height}px` }}
              />
            ))}
          </div>
          <input
            type="range"
            min="0"
            max={duration || 1}
            step="0.1"
            value={duration > 0 ? currentTime : 0}
            onChange={handleSeek}
            disabled={duration <= 0}
            className="absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0"
            aria-label={t("reviews.voice.seek")}
          />
        </div>
        <button
          type="button"
          className="grid h-6 w-[24px] flex-none -translate-y-2 cursor-pointer place-items-center border-0 bg-transparent text-[#333]"
          onClick={() => setIsExpanded((value) => !value)}
          aria-expanded={isExpanded}
          aria-label="More options"
        >
          <TextAlignStart size={20} strokeWidth={2} />
        </button>
      </div>

      <div className="flex -translate-y-3 items-center justify-between pl-12 text-[12px] leading-none text-[#8e8e8e]">
        <span>{formatTime(duration)}</span>
        <span>{messageClock}</span>
      </div>

      <div
        ref={detailsRef}
        className="origin-top max-h-0 overflow-hidden text-[12px] leading-[1.35] text-[#8e8e8e] opacity-0"
      >
        {transcriptText}
      </div>
    </article>
  );
}
