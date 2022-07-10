import { navbar } from "vuepress-theme-hope";
import {getChildren} from "../ultis";

export const en = navbar([
    "/",
    { text: "CTF", link: "ctf", children: getChildren("ctf") },
    { text: "hackthebox", link:"htb", children: getChildren("htb") },
    { text: "Wiki", link:"wiki", children: getChildren("wiki") },
    { text: "Blog", link:"blog", children: getChildren("blog") },
    { text: "About Me", link: "about" }
]);
