import type { ThemeFunction } from "@vuepress/core";
import { defaultTheme} from "vuepress";


export const umiTheme = (): ThemeFunction => (app) => {
    return {
        name: "umiTheme",
        extends: defaultTheme,
    }
}
