import { defineUserConfig } from "vuepress";
import theme from "./theme";

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "en-US",
      title: "A d3s34's blog",
      description: "Blog of d3s34",
    }
  },

  theme,
});
