import { terser } from "rollup-plugin-terser";
import { babel } from "@rollup/plugin-babel";
import postcss from "rollup-plugin-postcss";
import postcssMinify from "postcss-minify";
import { resolve } from "path";

export default {
  input: "src/bzSelect.js",
  output: {
    file: "dist/bzSelect.min.js",
    format: "umd",
    exports: "default",
    name: "bzSelect",
  },
  plugins: [
    terser(),
    babel({ babelHelpers: "bundled" }),
    postcss({
      extract: true,
      extract: resolve("dist/bzSelect.min.css"),
      plugins: [postcssMinify],
    }),
  ],
};
