export default function (props: { children: any; bgImage: string }) {
  return (
    <div className="hero" style={{ backgroundImage: `url(${props.bgImage})` }}>
      {props.children}
    </div>
  );
}

export const css = "@import './_components/Hero.css';";
