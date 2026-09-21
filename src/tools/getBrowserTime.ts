import { defineTool } from "@auipage/react";

/**
 * 前端工具（无 render）：获取浏览器当前时间
 * execute 的返回值即工具结果
 */
export default defineTool({
    name: "getBrowserTime",
    description: "获取当前浏览器所在设备的本地日期与时间",
    parameters: {
        type: "object",
        properties: {},
        required: [],
    },
    execute() {
        return new Date().toLocaleString();
    },
});
