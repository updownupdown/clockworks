import { GearProps, SettingsProps } from "./GearSets";
import { polar, rotate, q7, ratioDisplay } from "./GearMath";
import { getGearStyles } from "./GearUtils";
import clsx from "clsx";
import "./DrawGear.scss";

export const DrawGear = (
  { teeth, p, c, b, r, t, k, ratio, rpm, clockwise, parent }: GearProps,
  index: number,
  settings: SettingsProps
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
  const isEscapementGear = settings.isPendulum && index === 0;

  if (isEscapementGear) {
    // single tooth, escapement gear
    const inset = r * 0.9;
    const lean = -3;

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
  const textRad = r * (holeFactor + 1) * 0.5 - textSize / 4;

  const displayRatio = ratioDisplay(ratio);

  let displayText = "";

  if (!isEscapementGear) {
    displayText += `#${index + 1}: ${teeth} - ${displayRatio}`;
    displayText += `- RPM: ${Math.round(rpm * 10) / 10}`;
    displayText += `- P: ${parent !== undefined ? parent + 1 : "N/A"}`;
  }

  const isSelected = settings.selectedGear === index;

  return (
    <div
      className={clsx(
        "gear",
        isSelected && "gear--selected",
        isEscapementGear && "gear--escapement"
      )}
      style={getGearStyles(rpm, clockwise)}
    >
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
          className="gear-indicator"
          r="4"
          fill="none"
          transform={`translate(${c}, ${p * 2})`}
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
