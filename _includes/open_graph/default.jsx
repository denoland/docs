/** @jsxImportSource npm:react@18.2.0 */

export default function ({ title, description }) {
  if (!title) {
    title = "Deno documentation";
  }
  if (!description) {
    description = "The official Deno docs. Learn more at docs.deno.com";
  }
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#32f59a",
        fontSize: 26,
        fontWeight: 400,
        padding: "90px",
      }}
    >
      <h1
        style={{
          margin: "0",
          fontSize: 52,
          fontWeight: 800,
          width: "90%",
        }}
      >
        {title}
      </h1>
      <div
        style={{
          width: "400px",
          height: "2px",
          margin: "2rem 0",
          backgroundColor: "#000",
        }}
      >
      </div>
      <p
        style={{
          marginTop: 0,
          width: "70%",
          lineHeight: "1.6em",
        }}
      >
        {description}
      </p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 183.5 53.3"
        fill-rule="evenodd"
        style={{
          position: "absolute",
          bottom: "90px",
          right: "90px",
        }}
      >
        <path
          fill="#000"
          d="M122.5 28.9c0 .9 0 2.1-.2 2.6h-18.8c.9 3.2 3.4 5.2 6.9 5.2 2.9 0 4.9-1.2 6.4-3l4.7 4.3c-2.3 2.9-6.2 5-11.6 5-7.8 0-13.8-5.5-13.8-13.9s5.6-13.8 13.3-13.8 13.1 5.7 13.1 13.5zm-12.9-7.2c-2.9 0-5.2 1.6-6 4.7h11.8c-.7-2.8-2.6-4.7-5.8-4.7zm31.7-6.3c5.8 0 9.8 3.1 9.8 11.3v15.9h-7.2V28.5c0-5.1-1.8-6.7-5.2-6.7s-6.1 2.5-6.1 7.3v13.5h-7.2V15.8h7.2v3.5h.1c2.2-2.6 5.3-3.9 8.5-3.9zM168 43c-8.5 0-14.2-5.8-14.2-13.8s5.7-13.8 14.2-13.8 14.2 5.6 14.2 13.8S176.3 43 168 43zm0-6.4c3.9 0 7-3.1 7-7.4s-3-7.4-7-7.4-7 3.2-7 7.4 2.9 7.4 7 7.4zm-98 6V15.4h9.8c8.6 0 14.1 5.6 14.1 13.6s-5.2 13.6-14 13.6H70zm7.1-6.5h2.4c4.1 0 6.9-3.2 6.9-7.1s-2.8-7.2-6.3-7.2h-2.9V36zm-39.5-1c4.6.2 9.4-1.8 10.9-5.9s.9-8.2-4.4-10.6c-5.4-2.4-7.8-5.3-12.1-7.1-2.8-1.1-6-.5-9.2 1.3-8.7 4.8-16.5 20-12.9 34.1 0 .2 0 .4-.2.5h-.5c-4.8-5.3-7.6-12.6-7-20.3C3.2 12 16.3.7 31.3 1.9c15 1.1 26.2 14.2 25 29.2-.5 6.3-3.1 11.9-7 16.2-3 3.1-6.9 4.5-10.1 4.4-2.3 0-4.6-1-6.2-2.3-2.2-1.9-3.2-4.1-3.5-6.6 0-.6 0-2.3.3-3.4.2-.9.8-2.5 1.7-3.3-1-.4-2.4-1.4-2.8-1.9-.1-.1 0-.3 0-.4s.3-.2.4-.1c.9.3 2 .6 3.1.8 1.5.3 3.4.6 5.2.7zm-9.4-21.7c1.5-.1 2.7 1.1 3 2.8.3 2.2-.5 4.5-3.2 4.6-2.3 0-3-2.3-2.8-3.7s1.3-3.6 3.1-3.7z"
        />
      </svg>
    </div>
  );
}
