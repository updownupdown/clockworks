import * as React from "react";

function Gear(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="#000000"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M21.6171 11.2C21.6175 10.915 21.739 10.6434 21.9517 10.4537L22.8011 9.6961C23.1166 9.41466 23.2209 8.96442 23.0615 8.57279C22.7786 7.8779 22.6622 7.59769 22.3556 6.87413C22.1904 6.48402 21.7967 6.24 21.3738 6.26588L20.2642 6.3338C19.9783 6.3513 19.6985 6.24533 19.496 6.04276C19.0623 5.60905 18.7643 5.31108 18.3306 4.87737C18.128 4.6748 18.022 4.39508 18.0396 4.10915L18.1068 3.01115C18.133 2.58263 17.8821 2.18509 17.4845 2.02322C16.8014 1.74514 16.5198 1.62806 15.8072 1.32621C15.4127 1.15907 14.9547 1.26116 14.6695 1.58093L13.9196 2.42167C13.7299 2.63439 13.4584 2.75604 13.1734 2.75604H11.5265C11.2419 2.75604 10.9709 2.63484 10.7812 2.42279L9.97772 1.52469C9.69616 1.20997 9.24652 1.10618 8.8554 1.26538C8.15975 1.54856 7.87963 1.66499 7.1557 1.97167C6.7656 2.13694 6.52157 2.53063 6.54746 2.95351L6.61538 4.0631C6.63288 4.34903 6.52691 4.62874 6.32435 4.8313L5.15033 6.00532C4.95277 6.20288 4.68157 6.30878 4.40241 6.29738L3.2782 6.25145C2.85669 6.23423 2.46956 6.48413 2.31051 6.87487C2.02831 7.56815 1.91169 7.84878 1.60778 8.5662C1.44065 8.96074 1.54274 9.41865 1.8625 9.70387L2.70325 10.4538C2.91597 10.6435 3.03761 10.915 3.03761 11.2V12.846C3.03761 13.1311 2.91597 13.4026 2.70325 13.5923L1.85386 14.3499C1.53831 14.6314 1.43402 15.0816 1.59343 15.4732C1.8763 16.1681 1.99277 16.4483 2.2993 17.1719C2.46456 17.562 2.85826 17.806 3.28114 17.7801L4.39073 17.7122C4.67666 17.6947 4.95638 17.8007 5.15894 18.0033C5.59266 18.437 5.89062 18.7349 6.32434 19.1687C6.5269 19.3712 6.63288 19.6509 6.61538 19.9369L6.54817 21.0349C6.52194 21.4634 6.77281 21.8609 7.17044 22.0228C7.8535 22.3009 8.13517 22.418 8.84772 22.7198C9.24226 22.887 9.70018 22.7849 9.98539 22.4651L10.7353 21.6244C10.925 21.4116 11.1965 21.29 11.4816 21.29H13.1276C13.4126 21.29 13.6841 21.4116 13.8738 21.6244L14.6314 22.4737C14.9129 22.7893 15.3631 22.8936 15.7548 22.7342C16.4496 22.4513 16.7298 22.3348 17.4533 22.0283C17.8435 21.8631 18.0875 21.4693 18.0616 21.0464L17.9935 19.937C17.9759 19.651 18.0819 19.3712 18.2845 19.1686C18.7182 18.7349 19.0162 18.437 19.4499 18.0033C19.6524 17.8007 19.9321 17.6947 20.2181 17.7122L21.3161 17.7794C21.7446 17.8057 22.1421 17.5548 22.304 17.1572C22.5821 16.4741 22.6992 16.1924 23.001 15.4799C23.1682 15.0853 23.0661 14.6274 22.7463 14.3422L21.9261 13.6106C21.7015 13.4103 21.5798 13.1194 21.5908 12.8187C21.6123 12.2298 21.6164 11.7938 21.6171 11.2Z" />
    </svg>
  );
}

export default Gear;