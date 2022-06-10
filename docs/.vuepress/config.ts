import { defineUserConfig } from "vuepress";
import theme from "./theme";

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "en-US",
      title: "d3s34's blog",
      description: "Blog of d3s34",
    }
  },

  theme,
});
