import * as React from "react";

function ZoomReset(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="#000000"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M18.3825 14.7571H17.4905L17.1895 14.456C18.4717 12.9619 19.1519 10.9549 18.8731 8.78071C18.494 5.83712 16.2529 3.36183 13.3539 2.69284C8.62631 1.60014 4.44508 5.31307 4.44508 9.7396H2.1036C1.57955 9.7396 1.3454 10.3974 1.75795 10.7319L5.54893 13.7982C5.76078 14.0212 6.11758 14.0323 6.34057 13.8093L9.57406 10.6985C9.93085 10.3528 9.68556 9.7396 9.18381 9.7396H6.67507C6.67507 6.96327 8.90506 4.74443 11.6479 4.72213C14.3685 4.69983 16.71 7.00786 16.71 9.72845C16.71 12.4936 14.4577 14.7571 11.6925 14.7571C11.1908 14.7571 10.7002 14.679 10.2431 14.5452C9.86396 14.4337 9.45141 14.5452 9.17266 14.8351C8.58171 15.4261 8.81586 16.4519 9.60751 16.686C10.2654 16.8756 10.9678 16.9871 11.6925 16.9871C13.4877 16.9871 15.1267 16.3292 16.3978 15.2365L16.6989 15.5376V16.4184L21.4599 21.1571C21.917 21.6143 22.6529 21.6143 23.1101 21.1571C23.5672 20.7 23.5672 19.9529 23.1101 19.4958L18.3825 14.7571Z" />
    </svg>
  );
}

export default ZoomReset;
