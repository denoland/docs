export default function Banner(props: { children: any; type: string }) {
  return (
    <div
      className={`banner banner-${props.type}`}
    >
      {props.children}
    </div>
  );
}

export const css = "@import './_components/Banner.css';";
