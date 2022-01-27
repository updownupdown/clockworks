import * as React from "react";

function Download(props: React.SVGProps<SVGSVGElement>) {
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
        d="M15 9.5H16.59C17.48 9.5 17.92 10.58 17.29 11.21L12.7 15.8C12.31 16.19 11.68 16.19 11.29 15.8L6.7 11.21C6.07 10.58 6.52 9.5 7.41 9.5H9V4.5C9 3.95 9.45 3.5 10 3.5H14C14.55 3.5 15 3.95 15 4.5V9.5ZM6 20.5C5.45 20.5 5 20.05 5 19.5C5 18.95 5.45 18.5 6 18.5H18C18.55 18.5 19 18.95 19 19.5C19 20.05 18.55 20.5 18 20.5H6Z"
      />
    </svg>
  );
}

export default Download;
