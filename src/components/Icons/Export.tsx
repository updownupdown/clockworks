import * as React from "react";

function Export(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="#000000"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M21.2824 21.2643V8.24587C21.2824 8.03692 21.1963 7.84096 21.0491 7.70562L15.1231 2.1965C14.9878 2.07362 14.8037 2 14.6197 2H5.45386C5.04895 2 4.71765 2.33129 4.71765 2.73621V10.9569C4.71765 11.3618 5.04895 11.6931 5.45386 11.6931C5.85878 11.6931 6.19007 11.3618 6.19007 10.9569V3.47242H13.675V9.11633C13.675 9.52125 14.0063 9.85254 14.4113 9.85254H19.6871C19.7239 9.85254 19.7731 9.85254 19.8099 9.84009V20.5276H6.19007V17.5827C6.19007 17.1778 5.85878 16.8465 5.45386 16.8465C5.04895 16.8465 4.71765 17.1778 4.71765 17.5827V21.2638C4.71765 21.6687 5.04895 22 5.45386 22H20.5462C20.9511 22 21.2824 21.6692 21.2824 21.2643ZM15.1475 4.23299L19.6015 8.38012H15.1475V4.23299Z" />
      <path d="M3 14.1473C3 14.5523 3.33129 14.8836 3.73621 14.8836H11.4047L9.03638 16.9942C8.72999 17.2638 8.70508 17.7304 8.97521 18.0373C9.12245 18.197 9.31895 18.2826 9.52737 18.2826C9.69951 18.2826 9.87111 18.2214 10.0184 18.0985L13.8466 14.6876C14.0063 14.5528 14.0919 14.3444 14.0919 14.1354C14.0919 13.927 14.0058 13.7305 13.8466 13.5833L10.0184 10.1724C9.71196 9.90223 9.24533 9.92659 8.97575 10.2335C8.70617 10.5405 8.73053 11.0065 9.03692 11.2767L11.4421 13.4117H3.73621C3.33129 13.4111 3 13.7424 3 14.1473Z" />
    </svg>
  );
}

export default Export;
