import { defineUserConfig } from 'vuepress'
import {recoTheme} from "vuepress-theme-reco";
import {getChildren} from "./ultis";

export default defineUserConfig({
    theme: recoTheme({
        autoSetCategory: true,
        autoAddCategoryToNavbar: true,
        series: {
            "/": [
                {
                    text: "Home",
                    children: ["/"]
                },
                {
                    text: "CTF",
                    children: getChildren("ctf")
                },
                {
                    text: "Hack The Box",
                    children: getChildren("htb")
                },
                {
                    text: "Wiki",
                    children: getChildren("wiki")
                },
                {
                    text: "Blog",
                    children: getChildren("blog")
                },

            ]
        }
    }),
    extendsMarkdown: md => {
        const mathjax3 = require('markdown-it-mathjax3')
        md.use(mathjax3)
    }
})
