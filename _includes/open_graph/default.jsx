/** @jsxImportSource npm:react@18.2.0 */

export default function ({ title, description }) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        fontSize: 32,
        fontWeight: 600,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xml:space="preserve"
        fill-rule="evenodd"
        stroke-linejoin="round"
        stroke-miterlimit="2"
        clip-rule="evenodd"
        version="1.1"
        viewBox="0 0 1326 401"
        width="132px"
        height="40px"
        position="absolute"
      >
        <path d="m886 200-1 19H747c6 23 25 37 50 37 21 1 37-8 47-22l35 32c-17 21-46 37-85 37a97 97 0 0 1-102-102c0-60 42-101 98-101 58 0 96 42 96 100Zm-94-54c-22 0-39 12-45 35h87c-5-21-19-35-42-35Zm233-46c42 0 72 23 72 83v117h-53V196c0-37-13-49-38-49-26 0-45 19-45 54v99h-52V103h52v26h1c16-19 39-29 63-29Zm196 203c-62 0-104-43-104-101 0-59 42-102 104-102 61 0 105 41 105 102 0 60-44 101-105 101Zm0-47c29 0 51-23 51-54 0-33-22-55-51-55-31 0-51 24-51 55 0 30 21 54 51 54Zm-721 44V100h73c63 0 104 41 104 100s-38 100-103 100h-74Zm52-48h18c30 0 50-23 50-52 0-30-20-52-46-52h-22v104ZM262 245c34 2 69-13 80-44 11-30 7-60-33-78-39-18-57-39-89-52-21-8-44-3-68 10-64 35-121 147-95 250a3 3 0 0 1-5 3A199 199 0 0 1 215 1a200 200 0 0 1 133 334c-22 22-51 33-74 32a72 72 0 0 1-69-91c2-6 6-18 13-24-8-3-18-10-21-14v-3l3-1c7 3 15 5 23 6l39 5ZM193 85c11-1 20 8 22 21 2 16-4 33-24 33-17 1-22-16-21-27 1-10 10-26 23-27Z" />
      </svg>

      <div
        style={{
          fontSize: 48,
          fontWeight: 800,
        }}
      >
        {title}
      </div>
      <div>{description}</div>
    </div>
  );
}
