// The frame every Market Hub scene is drawn in: the look (dark, light or essay), the moving
// background, the veil that keeps the words readable and the brand line on top. Wide (a long
// video) or upright (a reel) follows from the film's size.
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import "./look.css";
import { Backdrop, Background, Tone } from "./backdrop";
import { useScene } from "./scene";

export const Look: React.FC<{
  look?: Tone;
  bg?: Background;
  seed?: string;              // another drawing of the same background; the scene's name if not said
  brand?: React.ReactNode;    // the line on top ("The Market Hub · A fondo"); none if null
  className?: string;
  children?: React.ReactNode;
}> = ({ look = "dark", bg = "tape", seed, brand = "The Market Hub", className = "", children }) => {
  const { width, height } = useVideoConfig();
  const scene = useScene();
  const classes = ["mh", look === "dark" ? "" : look === "essay" ? "light essay" : "light", width > height ? "wide" : "", bg === "plain" ? "plain" : "", className];
  return (
    <AbsoluteFill className={classes.filter(Boolean).join(" ")}>
      <Backdrop kind={bg} tone={look} seed={seed ?? scene.name} />
      {bg !== "plain" && <div className="veil" />}
      {brand !== null && <footer className="brand">{brand}</footer>}
      {children}
    </AbsoluteFill>
  );
};

/** The scene's column: where everything sits, inside the part of the screen Instagram leaves free
 * (upright) or the whole screen but a margin (wide). */
export const Column: React.FC<{ center?: boolean; full?: boolean; className?: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({
  center, full, className = "", style, children,
}) => <main className={["reel", center ? "center" : "", full ? "full" : "", className].filter(Boolean).join(" ")} style={style}>{children}</main>;
