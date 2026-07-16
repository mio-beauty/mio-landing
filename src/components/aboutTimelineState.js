const TRACK_WIDTH = 3200;
const EDGE_PADDING = 980;
const STEP_GAP = (TRACK_WIDTH - EDGE_PADDING * 2) / 4;
const END_HOLD_PROGRESS = 0.14;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function buildYearAnchors(stepCount) {
  return Array.from(
    { length: stepCount },
    (_, index) => EDGE_PADDING + STEP_GAP * index,
  );
}

export function getAboutTimelineState(progress, stepCount) {
  const anchors = buildYearAnchors(stepCount);
  const travelProgress = clamp(progress / (1 - END_HOLD_PROGRESS), 0, 1);
  const centerX =
    anchors[0] + (anchors[anchors.length - 1] - anchors[0]) * travelProgress;

  let activeIndex = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  anchors.forEach((anchor, index) => {
    const distance = Math.abs(anchor - centerX);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      activeIndex = index;
    }
  });

  return {
    activeIndex,
    centerX,
  };
}
