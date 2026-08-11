import { useEffect, useLayoutEffect, useRef, useState } from "react";

const INTRO_DURATION_MS = 1650;
const LETTERS = [
  { value: "M", delay: "0ms" },
  { value: "I", delay: "70ms" },
  { value: "O", delay: "140ms" },
  { value: "B", delay: "210ms" },
  { value: "E", delay: "280ms" },
  { value: "A", delay: "350ms" },
  { value: "U", delay: "420ms" },
  { value: "T", delay: "490ms" },
  { value: "Y", delay: "560ms" },
  { value: ".", delay: "630ms" },
];

const FINAL_LETTERS = [
  { value: "M", className: "loading-intro__final-letter--m", delay: "180ms" },
  { value: "B", className: "loading-intro__final-letter--b", delay: "390ms" },
  { value: ".", className: "loading-intro__final-letter--dot", delay: "810ms" },
];

export default function LoadingIntro() {
  const [isDone, setIsDone] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const stageRef = useRef(null);
  const letterRefs = useRef({});

  useLayoutEffect(() => {
    const root = document.documentElement;
    const previousOverflow = document.body.style.overflow;
    const previousRootOverflow = root.style.overflow;
    const previousOverscrollBehavior = document.body.style.overscrollBehavior;
    const previousRootOverscrollBehavior = root.style.overscrollBehavior;
    const previousTouchAction = document.body.style.touchAction;
    let introComplete = false;
    let pageLoaded = document.readyState === "complete";
    let removeTimeoutId = 0;

    root.style.overflow = "hidden";
    root.style.overscrollBehavior = "none";
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.body.style.touchAction = "none";

    const finishIntro = () => {
      if (!introComplete || !pageLoaded) {
        return;
      }

      setIsDone(true);
      root.style.overflow = previousRootOverflow;
      root.style.overscrollBehavior = previousRootOverscrollBehavior;
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehavior = previousOverscrollBehavior;
      document.body.style.touchAction = previousTouchAction;
      window.dispatchEvent(new CustomEvent("mio:intro-complete"));

      removeTimeoutId = window.setTimeout(() => {
        setIsMounted(false);
      }, 560);
    };

    const introTimeoutId = window.setTimeout(() => {
      introComplete = true;
      finishIntro();
    }, INTRO_DURATION_MS);

    const handlePageLoad = () => {
      pageLoaded = true;
      finishIntro();
    };

    if (pageLoaded) {
      finishIntro();
    } else {
      window.addEventListener("load", handlePageLoad, { once: true });
    }

    return () => {
      window.clearTimeout(introTimeoutId);
      window.clearTimeout(removeTimeoutId);
      window.removeEventListener("load", handlePageLoad);
      root.style.overflow = previousRootOverflow;
      root.style.overscrollBehavior = previousRootOverscrollBehavior;
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehavior = previousOverscrollBehavior;
      document.body.style.touchAction = previousTouchAction;
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) {
      return undefined;
    }

    const updateFinalPositions = () => {
      const stageRect = stage.getBoundingClientRect();
      const setPosition = (name, index) => {
        const letter = letterRefs.current[index];

        if (!letter || !stageRect.width) {
          return;
        }

        const rect = letter.getBoundingClientRect();
        const center = rect.left + rect.width / 2 - stageRect.left;
        stage.style.setProperty(`--intro-${name}-left`, `${center}px`);
      };

      setPosition("m", 0);
      setPosition("b", 3);
      setPosition("dot", 9);
    };

    updateFinalPositions();

    window.addEventListener("resize", updateFinalPositions);
    return () => {
      window.removeEventListener("resize", updateFinalPositions);
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={`loading-intro ${isDone ? "loading-intro--done" : ""}`}
      aria-label="MIO BEAUTY loading"
    >
      <div ref={stageRef} className="loading-intro__stage" aria-hidden="true">
        {LETTERS.map((letter, index) => (
          <span
            key={`${letter.value}-${index}`}
            className="loading-intro__letter"
            ref={(node) => {
              if (node) {
                letterRefs.current[index] = node;
              } else {
                delete letterRefs.current[index];
              }
            }}
            style={{ "--intro-letter-delay": letter.delay }}
          >
            {letter.value}
          </span>
        ))}

        <span className="loading-intro__final" aria-hidden="true">
          {FINAL_LETTERS.map((letter, index) => (
            <span
              key={`${letter.value}-${index}`}
              className={`loading-intro__final-letter ${letter.className}`}
              style={{ "--intro-letter-delay": letter.delay }}
            >
              <span className="loading-intro__final-letter-inner">
                {letter.value}
              </span>
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
