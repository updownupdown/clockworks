import * as React from "react";

function Check(props: React.SVGProps<SVGSVGElement>) {
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
        d="M2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12ZM5.7 12.7L9.29 16.29C9.68 16.68 10.32 16.68 10.7 16.29L18.29 8.7C18.68 8.31 18.68 7.68 18.29 7.29C17.9 6.9 17.27 6.9 16.88 7.29L10 14.17L7.11 11.29C6.72 10.9 6.09 10.9 5.7 11.29C5.51275 11.4768 5.40751 11.7305 5.40751 11.995C5.40751 12.2595 5.51275 12.5132 5.7 12.7Z"
      />
    </svg>
  );
}

export default Check;
