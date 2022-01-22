// degrees to radians
export function degrees_to_radians(theta: number) {
  return (theta / 180) * Math.PI;
}

export function radians_to_degrees(theta: number) {
  return (theta / Math.PI) * 180;
}

// polar to cartesian
function polar(r: number, theta: number) {
  return [r * Math.sin(theta), r * Math.cos(theta)];
}

// point on involute curve
function q6(b: number, s: number, t: number, d: number) {
  return polar(d, s * (iang(b, d) + t));
}

// unwind this many degrees to go from r1 to r2
export function iang(r1: number, r2: number) {
  return Math.sqrt((r2 / r1) * (r2 / r1) - 1) - Math.acos(r1 / r2);
}

// radius a fraction f up the curved side of the tooth
function q7(f: number, r: number, b: number, r2: number, t: number, s: number) {
  return q6(b, s, t, (1 - f) * Math.max(b, r) + f * r2);
}

// rotate an array of 2d points
function rotate(points_array: any, angle: number) {
  var answer = [];
  for (var i = 0; i < points_array.length; i++) {
    const x = points_array[i][0];
    const y = points_array[i][1];
    const xr = x * Math.cos(angle) - y * Math.sin(angle);
    const yr = y * Math.cos(angle) + x * Math.sin(angle);
    answer.push([xr, yr]);
  }
  return answer;
}

export const defaultGears: GearProps[] = [
  {
    parent: undefined,
    teeth: 40,
    angleOffset: 27,
  },
  {
    parent: 0,
    teeth: 20,
    angleOffset: 118,
  },
  {
    parent: 1,
    teeth: 10,
    angleOffset: 10,
    fixed: true,
  },
  {
    parent: 2,
    teeth: 19,
    angleOffset: 20,
  },
  {
    parent: 2,
    teeth: 11,
    angleOffset: 20,
  },
  {
    parent: 2,
    teeth: 29,
    angleOffset: 120,
    fixed: true,
  },
  {
    parent: 2,
    teeth: 24,
    angleOffset: -20,
  },
];

export interface GearProps {
  parent: number | undefined;
  /** number of teeth (typically the only parameter to change) note: rest of parameters must be unchanged if you want gears to fit. **/
  teeth: number;
  // /** pixel size of one gear tooth (even though it says millimeters, it's pixels) must be same for two gears to fit each other
  // toothSize: number;
  // /** freedom between two gear centers **/
  // clearance: number;
  // /** in degrees, determines gear shape, range is 10 to 40 degrees, most common is 20 degrees **/
  // pressure_angle: number;
  /** freedom between two gear contact points **/
  // backlash: number;
  // /** angle offset relative to parent gear **/
  angleOffset: number;
  /** center position **/
  centerOffset?: { x: number; y: number };
  /** rotation position **/
  rotationOffset?: number;
  /** number of rotations **/
  numRotations?: number;
  /** fixed to parent gear **/
  fixed?: boolean;
  /** fixed to parent gear **/
  ratio?: number;
  /** fixed to parent gear **/
  totalRatio?: number;
  /** rotation per minute **/
  rpm?: number;
  /** rotation direction **/
  clockwise?: boolean;
  /** radius of pitch circle **/
  p?: number;
  /** radius of outer circle **/
  c?: number;
  /** radius of base circle **/
  b?: number;
  /** radius of root circle **/
  r?: number;
  /** tooth thickness at pitch circle **/
  t?: number;
  /** angle where involute meets base circle on side of tooth **/
  k?: number;
}

export interface Coordinates {
  x: number;
  y: number;
}

export const GearSvg = (
  { teeth, p, c, b, r, t, k, ratio, rpm, clockwise }: GearProps,
  index: number
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

  console.log("DRAWING SVG");

  // set of [x,y] points to create a single gear tooth
  const points = [
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

  let svgPoints: any = [];

  // create every gear tooth by rotating the first tooth
  for (var i = 0; i < teeth; i++) {
    svgPoints = svgPoints.concat(rotate(points, (-i * 2 * Math.PI) / teeth));
  }

  const holeFactor = 0.5;
  const textSize = r * 0.2;
  const holeSize = r * holeFactor;
  const textRad = r * (holeFactor + 1) * 0.5 - textSize / 2;

  const ratioDisplay =
    ratio < 1
      ? "1:" + Number(Math.round((1 / ratio) * 10) / 10)
      : Math.round(ratio * 10) / 10 + ":1";

  return (
    <svg
      className="gear"
      height={c * 2}
      width={c * 2}
      viewBox={`-1 -1 ${c * 2 + 2} ${c * 2 + 2}`}
      style={{
        animationDuration: `${Math.abs(60 / rpm)}s`,
        animationDirection: clockwise ? "normal" : "reverse",
      }}
    >
      <polygon
        className="gear-shape"
        mask={`url(#rmvRct-${index})`}
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
        // stroke="blue"
      />
      <text className="gear-text">
        <textPath fontSize={`${textSize}px`} href={`#textpath-${r}`}>
          #{index + 1}: {teeth} - {ratioDisplay} - RPM:{" "}
          {Math.round(rpm * 10) / 10}
        </textPath>
      </text>
    </svg>
  );
};
