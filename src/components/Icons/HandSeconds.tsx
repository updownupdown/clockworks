import * as React from "react";

function HandSeconds(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={732}
      height={732}
      viewBox="0 0 732 732"
      fill="#000000"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M367.83 36.8713C367.83 35.8606 367.011 35.0413 366 35.0413V35.0413C364.989 35.0413 364.17 35.8606 364.17 36.8713V330.298C364.17 331.269 363.383 332.056 362.412 332.056V332.056C361.441 332.056 360.654 332.843 360.654 333.814V396.155C360.654 398.364 362.445 400.155 364.654 400.155H367.345C369.555 400.155 371.345 398.364 371.345 396.155V333.814C371.345 332.843 370.559 332.056 369.588 332.056V332.056C368.617 332.056 367.83 331.269 367.83 330.298V36.8713Z"
      />
    </svg>
  );
}

export default HandSeconds;
