import { navbar } from "vuepress-theme-hope";

export const en = navbar([
  "/",
  "/home",
  { text: "Guide", icon: "creative", link: "/guide/" },
  {
    text: "Theme Docs",
    icon: "note",
    link: "https://vuepress-theme-hope.github.io/v2/",
  },
  { text: "CTF", link: "ctf" },
  { text: "hackthebox", link:"htb" },
  { text: "Wiki", link:"wiki" },
  { text: "Blog", link:"blog" },
  { text: "About Me", link: "about" }
]);
