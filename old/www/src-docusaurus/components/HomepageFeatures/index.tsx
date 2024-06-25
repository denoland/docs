import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Better out of the box",
    Svg: require("@site/static/img/deno-box.svg").default,
    description: (
      <>
        The Deno runtime has support for TypeScript and JSX out of the box,
        along with a built-in key/value store, linter, formatter, and testing
        library.
      </>
    ),
  },
  {
    title: "Secure by default",
    Svg: require("@site/static/img/deno-shield.svg").default,
    description: (
      <>
        Fine-grained permissions let you control what APIs are accessible to
        your programs and their dependencies.
      </>
    ),
  },
  {
    title: "Deploy globally in seconds",
    Svg: require("@site/static/img/deno-balloon.svg").default,
    description: (
      <>
        Easily create globally distributed app servers with&nbsp;
        <a href="https://www.deno.com/deploy" target="_blank">Deno Deploy</a>.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => <Feature key={idx} {...props} />)}
        </div>
      </div>
    </section>
  );
}
