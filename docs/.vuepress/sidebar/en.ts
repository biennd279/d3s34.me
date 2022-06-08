import { sidebar } from "vuepress-theme-hope";

export const en = sidebar({
  "/": [
    "",
    "home",
    "slide",
    {
      icon: "creative",
      text: "Guide",
      prefix: "guide/",
      link: "guide/",
      children: "structure",
    },
    { text: "CTF", link: "ctf" },
    { text: "hackthebox", link:"htb" },
    { text: "Wiki", link:"wiki" },
    { text: "Blog", link:"blog" },
    { text: "About Me", link: "about" }
  ],
});
