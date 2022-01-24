import { GearProps } from "./Gear";
import { polar, rotate, q7, ratioDisplay } from "./utils";
import { HandsProps } from "../Menu/Menu";
import HandHours from "../Hands/HandHours";
import HandMinutes from "../Hands/HandMinutes";
import HandSeconds from "../Hands/HandSeconds";
import clsx from "clsx";

export const DrawGear = (
  { teeth, p, c, b, r, t, k, ratio, rpm, clockwise, parent }: GearProps,
  index: number,
  isSelected: boolean,
  isPendulum: boolean,
  hands: HandsProps
) => {
  if (
    rpm === undefined ||
    ratio === undefined ||
    p === undefined ||
    c === undefined ||
    b === undefined ||
    r === undefined ||
    t === undefined ||
    k === undefined
  )
    return <span />;

  let points = [];
  const isEscapementGear = isPendulum && index === 0;

  if (isEscapementGear) {
    // single tooth, escapement gear
    const inset = r * 0.85;
    const lean = -5;

    points = [
      polar(inset, -3.142 / teeth),
      polar(c, lean / teeth),
      polar(inset, 3.142 / teeth),
    ];
  } else {
    // single tooth, regular gear
    points = [
      polar(r, -3.142 / teeth),
      polar(r, r < b ? k : -Math.PI / teeth),
      q7(0 / 5, r, b, c, k, 1),
      q7(1 / 5, r, b, c, k, 1),
      q7(2 / 5, r, b, c, k, 1),
      q7(3 / 5, r, b, c, k, 1),
      q7(4 / 5, r, b, c, k, 1),
      q7(5 / 5, r, b, c, k, 1),
      q7(5 / 5, r, b, c, k, -1),
      q7(4 / 5, r, b, c, k, -1),
      q7(3 / 5, r, b, c, k, -1),
      q7(2 / 5, r, b, c, k, -1),
      q7(1 / 5, r, b, c, k, -1),
      q7(0 / 5, r, b, c, k, -1),
      polar(r, r < b ? -k : Math.PI / teeth),
      polar(r, 3.142 / teeth),
    ];
  }

  let svgPoints: any = [];

  // create every gear tooth by rotating the first tooth
  for (var i = 0; i < teeth; i++) {
    svgPoints = svgPoints.concat(rotate(points, (-i * 2 * Math.PI) / teeth));
  }

  const holeFactor = 0.5;
  const textSize = r * 0.2;
  const holeSize = r * holeFactor;
  const textRad = r * (holeFactor + 1) * 0.5 - textSize / 2;

  const displayRatio = ratioDisplay(ratio);

  let displayText = "";

  if (!isEscapementGear) {
    displayText += `#${index + 1}: ${teeth} - ${displayRatio}`;
    displayText += `- RPM: ${Math.round(rpm * 10) / 10}`;
    displayText += `- P: ${parent}`;
  }

  return (
    <div
      className={clsx(
        "gear",
        isSelected && "gear--selected",
        isEscapementGear && "gear--escapement"
      )}
      style={{
        animationDuration: `${Math.abs(60 / rpm)}s`,
        animationDirection: clockwise ? "normal" : "reverse",
      }}
    >
      <div className="clock-hand">
        {hands.hours === index && <HandHours />}
        {hands.minutes === index && <HandMinutes />}
        {hands.seconds === index && <HandSeconds />}
      </div>

      <svg
        height={c * 2}
        width={c * 2}
        viewBox={`-1 -1 ${c * 2 + 2} ${c * 2 + 2}`}
      >
        <polygon
          className="gear-shape"
          transform={`translate(${c}, ${c})`}
          points={svgPoints.toString()}
        ></polygon>

        <circle
          className="gear-center"
          r={holeSize}
          transform={`translate(${c}, ${c})`}
        ></circle>

        <circle
          className="gear-indicator"
          r="6"
          fill="none"
          transform={`translate(${c}, ${p * 2})`}
        ></circle>

        <circle
          className="gear-pitch"
          r={p}
          fill="none"
          transform={`translate(${c}, ${c})`}
        ></circle>

        <path
          className="gear-textpath"
          id={`textpath-${r}`}
          d={`M ${textRad},0 A ${textRad},${textRad} 0 0 1 -${textRad},0 A ${textRad},${textRad} 0 0 1 ${textRad},0`}
          transform={`translate(${c},${c})`}
        />
        <text className="gear-text">
          <textPath fontSize={`${textSize}px`} href={`#textpath-${r}`}>
            {displayText}
          </textPath>
        </text>
      </svg>
    </div>
  );
};
