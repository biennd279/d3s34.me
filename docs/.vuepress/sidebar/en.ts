import { sidebar } from "vuepress-theme-hope";
import { getChildren } from "../utils";

export const en = sidebar({
  "/": [
    "",
    { text: "CTF", link: "ctf", children: getChildren("ctf") },
    { text: "hackthebox", link:"htb", children: getChildren("htb") },
    { text: "Wiki", link:"wiki", children: getChildren("wiki") },
    { text: "Blog", link:"blog", children: getChildren("blog") },
    { text: "About Me", link: "/about" }
  ],
});
