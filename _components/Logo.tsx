export const css = `
.light .logo-name {
  fill: black;
} 
.dark .logo-name {
  fill: white;
}
`;

export default function Logo() {
  return (
    <svg
      viewBox="0 0 1025 331"
      xmlns="http://www.w3.org/2000/svg"
      className="logo"
    >
      <title>Deno docs logo</title>
      <circle fill="white" cx="165.2" cy="165.1" r="165.2" />
      <path
        fill="black"
        d="M28.4,228C.2,168.1,14.9,96.9,64.4,53,125.2-3.2,220.1.6,276.3,61.4c53.4,57.9,53,147.2-1,204.6-14.6,15.3-34.9,23.9-56,24-12,0-25-5-34-12-16.2-13.7-22.8-35.6-17-56,1-5,4-14,9-18-5-2-13-8-15-10v-3h2l17,4,29,4c26,1,52-10,60-33,9-23,5-45-24-59-30-13-43-29-67-39-16-6-33-2-51,8-48,26-91,110-71,188,.6,1.1.1,2.4-1,3s-2.4.1-3-1c-10.2-11.3-18.6-24.1-25-38Z"
      />
      <path
        fill="black"
        d="M160,79c8-1,15,6,16,15,2,12-3,25-18,25-12,1-16-12-15-20,1-7,7-19,17-20Z"
      />
      <path
        d="M629 242c-47 0-79-32-79-76s32-76 79-76c46 0 78 31 78 76 0 46-32 76-78 76Zm0-35c21 0 38-17 38-41s-16-41-38-41c-23 0-39 18-39 41s16 41 39 41Zm169 35c-44 0-76-30-76-76 0-45 32-76 78-76 23 0 48 9 62 28l-26 23c-8-9-20-16-35-16-23 0-39 17-39 41s16 41 40 41c15 0 27-7 34-15l27 24a85 85 0 0 1-65 26Zm138 0c-24 0-44-7-60-21l19-28c13 12 25 18 41 18 12 0 18-5 18-12s-7-11-27-17c-24-8-45-19-45-48 0-26 23-44 53-44 21 0 38 5 54 18l-19 29a53 53 0 0 0-35-15c-7 0-15 3-15 11 0 6 8 10 23 16 32 11 50 18 50 47 0 27-18 46-57 46Zm-531-2V90h54c48 0 78 31 78 75s-28 75-77 75h-55Zm39-36h13c23 0 38-17 38-39s-15-39-35-39h-16v78Z"
        className="logo-name"
      />
    </svg>
  );
}
