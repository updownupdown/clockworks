import React from "react";

// degrees to radians
export function degrees_to_radians(theta: number) {
  return (theta / 180) * Math.PI;
}

export function radians_to_degrees(theta: number) {
  return (theta / Math.PI) * 180;
}

// polar to cartesian
export function polar(r: number, theta: number) {
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
export function q7(
  f: number,
  r: number,
  b: number,
  r2: number,
  t: number,
  s: number
) {
  return q6(b, s, t, (1 - f) * Math.max(b, r) + f * r2);
}

// rotate an array of 2d points
export function rotate(points_array: any, angle: number) {
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

export function ratioDisplay(ratio: number) {
  return ratio < 1
    ? "1 : " + Number(Math.round((1 / ratio) * 10) / 10)
    : Math.round(ratio * 10) / 10 + " : 1";
}
