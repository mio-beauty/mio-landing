import { buildYearAnchors } from "./aboutTimelineState.js";

const TRACK_WIDTH = 3200;
const TRACK_HEIGHT = 148;
const BASELINE_Y = 94;
const YEAR_TOP = 28;
const EDGE_PADDING = 980;
const TRACK_START_X = EDGE_PADDING;
const TRACK_END_X = TRACK_WIDTH - EDGE_PADDING;
const TICK_COUNT = 121;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function buildTicks() {
  return Array.from({ length: TICK_COUNT }, (_, index) => {
    const progress = index / (TICK_COUNT - 1);
    const x = TRACK_START_X + (TRACK_END_X - TRACK_START_X) * progress;
    const height = index % 12 === 0 ? 38 : index % 6 === 0 ? 26 : 16;

    return {
      key: `tick-${index}`,
      x,
      height,
    };
  });
}

const TICKS = buildTicks();

function YearLabel({ year, anchorX, isActive, isPassed }) {
  const className = `leading-none transition-all duration-500 ${
    isActive
      ? "scale-100 text-[56px] font-semibold text-[#111111]"
      : isPassed
        ? "scale-[0.92] text-[34px] font-medium text-[#8E857E]"
        : "scale-[0.92] text-[34px] font-medium text-[#B8AEA6]"
  }`;

  return (
    <div
      className="absolute -translate-x-1/2 text-center"
      style={{
        left: `${anchorX}px`,
        top: `${YEAR_TOP}px`,
      }}
    >
      <div className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
        {year}
      </div>
    </div>
  );
}

export default function AboutTimeline({ steps, activeIndex, centerX }) {
  const anchors = buildYearAnchors(steps.length);
  const clampedCenterX = clamp(
    centerX,
    anchors[0],
    anchors[anchors.length - 1],
  );

  return (
    <div className="relative overflow-hidden   px-12 py-8">
      <div className="pointer-events-none absolute inset-y-6 left-1/2 w-px -translate-x-1/2 bg-[#D9CEC4]" />
      <div className="pointer-events-none absolute left-1/2 top-5 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-white bg-[#FE946E] shadow-[0_8px_24px_rgba(214,31,38,0.24)]" />

      <div
        className="relative left-1/2 will-change-transform"
        style={{
          height: `${TRACK_HEIGHT}px`,
          width: `${TRACK_WIDTH}px`,
          transform: `translateX(-${clampedCenterX}px)`,
        }}
      >
        <div
          className="absolute h-px bg-[#D9CEC4]"
          style={{
            left: `${TRACK_START_X}px`,
            width: `${TRACK_END_X - TRACK_START_X}px`,
            top: `${BASELINE_Y}px`,
          }}
        />

        {TICKS.map((tick) => (
          <span
            key={tick.key}
            className="absolute w-px -translate-x-1/2 bg-[#CFC3B8]"
            style={{
              left: `${tick.x}px`,
              top: `${BASELINE_Y}px`,
              height: `${tick.height}px`,
            }}
          />
        ))}

        {steps.map((step, index) => (
          <YearLabel
            key={step.year}
            year={step.year}
            anchorX={anchors[index]}
            isActive={index === activeIndex}
            isPassed={index < activeIndex}
          />
        ))}
      </div>
    </div>
  );
}
