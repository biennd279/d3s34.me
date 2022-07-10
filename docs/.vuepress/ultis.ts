import {glob} from "glob";

// Load all MD files in a specified directory and order by metadata 'order' value
export const getChildren = function(dir: string) {
    // Return the ordered list of files, sort by 'order' then 'path'
    return glob.sync(`docs/${dir}/*.md`)
        .filter(f => !f.includes("README.md"))
        .map(f => f.slice(4));
};

// module.exports = {
//     getChildren,
// };
