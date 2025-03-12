/** @jsxImportSource npm:react@18.2.0 */

export default function ({ title, description, openGraphTitle }) {
  if (!openGraphTitle) {
    title = "deno help";
  }
  if (!description) {
    description = "Learn more at docs.deno.com";
  }

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background:
          `radial-gradient(circle at 95% 95%, #090909 10%, #292929 70%)`,
        fontSize: 28,
        fontWeight: 400,
        padding: "0 90px",
        textWrap: "balance",
        color: "#fff",
        fontFamily: "Inter",
      }}
    >
      <p
        style={{
          fontSize: "18px",
          lineHeight: "1",
          marginBottom: "2rem",
          textTransform: "uppercase",
        }}
      >
        docs.deno.com
      </p>
      <h1
        style={{
          margin: "0",
          fontSize: 60,
          fontWeight: 800,
          lineHeight: "1.1",
          marginTop: 0,
          marginLeft: "-16px",
          marginBottom: "2rem",
        }}
      >
        <span
          style={{
            background: "#000",
            borderRadius: "10px",
            padding: "10px 18px 4px 18px",
            fontFamily: "Courier",
            lineHeight: "1.2",
            color: "#ffffff",
            textShadow: "0 0 8px #70ffafff",
          }}
        >
          {openGraphTitle}
        </span>
      </h1>
      <p
        style={{
          marginTop: 0,
          width: "72%",
          lineHeight: "1.5",
        }}
      >
        {description}
      </p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 501 501"
        stroke-linejoin="round"
        stroke-miterlimit="2"
        clip-rule="evenodd"
        style={{
          position: "absolute",
          bottom: "2rem",
          right: "2rem",
          width: "100px",
          height: "100px",
        }}
      >
        <path
          fill="#fff"
          d="M230 0a220 220 0 1 1-20 440A220 220 0 0 1 230 0Zm52 265-39-5c-8-1-16-3-23-6l-3 1v3c3 4 13 11 21 14-7 6-11 18-13 24a72 72 0 0 0 69 91c23 1 52-10 74-32a200 200 0 1 0-296 0 3 3 0 0 0 5-4c-26-103 31-215 95-250 24-13 47-18 68-10 32 13 50 34 89 52 40 18 44 48 33 78-11 31-46 46-80 44Zm-69-160c-13 1-22 17-23 27-1 11 4 28 21 27 20 0 26-17 24-33-2-13-11-22-22-21Z"
        />
      </svg>
    </div>
  );
}
