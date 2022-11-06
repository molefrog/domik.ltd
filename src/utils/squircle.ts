import squircleWorklet from "css-houdini-squircle/squircle.min.js?url";

if ("paintWorklet" in CSS) {
  (CSS as any).paintWorklet.addModule(squircleWorklet);
}
