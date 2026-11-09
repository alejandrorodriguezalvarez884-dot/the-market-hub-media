// A company's logo, from theme/logos/ (Simple Icons, CC0, or drawn here: theme/logos/SOURCES.md),
// never from the network. On a white tile so every brand colour reads.
import React from "react";
import { Img } from "remotion";

declare const require: { context: (dir: string, deep: boolean, match: RegExp) => { keys(): string[]; (key: string): string | { default: string } } };
const files = require.context("../../../theme/logos", false, /\.svg$/);
const LOGOS: Record<string, string> = Object.fromEntries(
  files.keys().map((key) => {
    const found = files(key);
    return [key.replace(/^\.\//, "").replace(/\.svg$/, ""), typeof found === "string" ? found : found.default];
  }),
);

export const logoUrl = (name: string): string => {
  const url = LOGOS[name];
  if (!url) throw new Error(`no theme/logos/${name}.svg (there are: ${Object.keys(LOGOS).join(", ")})`);
  return url;
};

export const Logo: React.FC<{ name: string; big?: boolean; className?: string; style?: React.CSSProperties }> = ({ name, big, className = "", style }) => (
  <span className={["logo", big ? "big" : "", className].filter(Boolean).join(" ")} style={style}>
    <Img src={logoUrl(name)} alt={name} />
  </span>
);
