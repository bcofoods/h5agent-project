import { readPlain } from "oipage/nodejs/disk/index.js";

export default {
    description: {
        type: "function",
        function: {
            name: "readPlain",
            description: "读取文本文件中的内容",
            parameters: {
                type: "object",
                properties: {
                    filepath: {
                        type: "string",
                        description: "需要读取的文本文件的路径",
                    }
                },
                required: ["filepath"],
            },
        },
    },
    execute: async function (args) {
        return readPlain(args.filepath);
    }
};