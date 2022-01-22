import * as React from "react";

function Pause(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="#000000"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 17C10 18.1 9.1 19 8 19C6.9 19 6 18.1 6 17V7C6 5.9 6.9 5 8 5C9.1 5 10 5.9 10 7V17ZM14 17V7C14 5.9 14.9 5 16 5C17.1 5 18 5.9 18 7V17C18 18.1 17.1 19 16 19C14.9 19 14 18.1 14 17Z"
      />
    </svg>
  );
}

export default Pause;
