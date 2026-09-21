import React from "react";
import { defineTool } from "@auipage/react";
import type { ToolRenderProps } from "@auipage/react";

// 实际项目里这里会是发请求获取的候选列表，此处写死
const FRUITS = ["苹果", "香蕉", "橙子", "葡萄", "西瓜"];

/**
 * 问水果工具的 render 组件
 * - 实时态（有 call）：用 execute 返回的 result 渲染水果按钮，点击后 call(水果名) 交还结果
 * - 历史态（无 call）：用 uiResult 只读展示当时的选择
 */
function AskFavoriteFruitRender(props: ToolRenderProps) {
    const { call, uiResult, result, status } = props;

    if (!call) {
        return <span className="fruit-picker-readonly">已选择：{String(uiResult)}</span>;
    }

    // execute 异常时兜底为空列表，避免渲染崩溃
    const fruits: string[] = status === "success" && Array.isArray(result) ? result : [];

    return (
        <div className="fruit-picker">
            <div className="fruit-picker-tip">请选择你喜欢的水果：</div>
            <div className="fruit-picker-options">
                {fruits.map((fruit) => (
                    <button
                        key={fruit}
                        type="button"
                        className="fruit-picker-btn"
                        onClick={() => call(fruit)}
                    >
                        {fruit}
                    </button>
                ))}
            </div>
        </div>
    );
}

/**
 * 前端工具（有 render）：询问用户喜欢哪种水果
 * execute 返回候选水果列表
 * render 组件据此渲染按钮，用户点击后 call 的值即工具最终结果。
 */
export default defineTool({
    name: "askFavoriteFruit",
    description: "当需要了解用户喜欢什么水果时使用，会弹窗询问用户并返回所选水果",
    parameters: {
        type: "object",
        properties: {},
        required: [],
    },
    execute() {
        // 这里写死，实际项目可改为发请求获取
        return FRUITS;
    },
    render: AskFavoriteFruitRender,
});
