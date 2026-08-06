import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Mic, Paperclip, Pause, Play } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider.jsx";
import "./VoiceReviewPhone.scss";

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
  customerName,
  city,
  productImage,
}) {
  const { t, language } = useI18n();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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
    <div className="voice-review-phone">
      <div className="voice-review-phone__screen">
        <audio ref={audioRef} src={audioUrl} preload="metadata" />

        <div className="voice-review-phone__statusbar" aria-hidden="true">
          <span>18:51</span>
          <span className="voice-review-phone__status-icons">••• ◒ 12%</span>
        </div>

        <div className="voice-review-phone__telegram">
          <div className="voice-review-phone__telegram-header">
            <div className="voice-review-phone__header-left">
              <button
                type="button"
                className="voice-review-phone__icon-button voice-review-phone__icon-button--back"
              >
                <ArrowLeft size={19} />
              </button>
            </div>

            <div className="voice-review-phone__contact voice-review-phone__contact--center">
              <p className="voice-review-phone__contact-name">{customerName}</p>
              <p className="voice-review-phone__contact-status">
                {t("reviews.voice.status")}
              </p>
            </div>

            <div className="voice-review-phone__avatar">
              {customerName.slice(0, 1)}
            </div>
          </div>

          <div className="voice-review-phone__chat">
            <div className="voice-review-phone__day-pill">
              {t("reviews.voice.day")}
            </div>

            <div className="voice-review-phone__incoming">
              <div className="voice-review-phone__message voice-review-phone__message--media voice-review-phone__message--incoming">
                <div className="voice-review-phone__product-panel">
                  <img
                    src={productImage}
                    alt={city || customerName}
                    className="voice-review-phone__product-image"
                    draggable="false"
                  />
                </div>
                <span className="voice-review-phone__message-time">
                  {messageClock}
                </span>
              </div>

              <div className="voice-review-phone__message voice-review-phone__message--voice voice-review-phone__message--incoming">
                <div className="voice-review-phone__voice-top">
                  <button
                    type="button"
                    className="voice-review-phone__play-button"
                    onClick={handleTogglePlayback}
                    aria-label={
                      isPlaying
                        ? t("reviews.voice.pause")
                        : t("reviews.voice.play")
                    }
                  >
                    {isPlaying ? (
                      <Pause size={20} strokeWidth={2.8} />
                    ) : (
                      <Play size={19} strokeWidth={2.8} fill="currentColor" />
                    )}
                  </button>

                  <div className="voice-review-phone__wave-wrap">
                    <div className="voice-review-phone__wave">
                      {waveBars.map((bar, index) => (
                        <span
                          key={index}
                          className={bar.isActive ? "is-active" : ""}
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
                      className="voice-review-phone__seek"
                      aria-label={t("reviews.voice.seek")}
                    />
                  </div>
                </div>

                <div className="voice-review-phone__voice-footer">
                  <div className="voice-review-phone__voice-meta">
                    <span>{formatTime(currentTime)}</span>
                    <span className="voice-review-phone__voice-dot" />
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                <span className="voice-review-phone__message-time">
                  {messageClock}
                </span>
              </div>
            </div>
          </div>

          <div className="voice-review-phone__composer">
            <button
              type="button"
              className="voice-review-phone__composer-attach"
            >
              <Paperclip size={18} />
            </button>
            <div className="voice-review-phone__composer-field">
              <span>{t("reviews.voice.message")}</span>
            </div>
            <button type="button" className="voice-review-phone__composer-send">
              <Mic size={19} strokeWidth={2.3} />
            </button>
          </div>
        </div>

        <div
          className="voice-review-phone__home-indicator"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
