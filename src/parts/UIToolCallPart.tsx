import React from "react";
import type { ToolCallPart } from "@auipage/react";

/** 把任意值格式化为可读文本 */
function formatValue(value: unknown): string {
    if (value === void 0) return "";
    if (typeof value === "string") return value;
    if (value instanceof Error) return value.message || String(value);
    try {
        return JSON.stringify(value, null, 2);
    } catch {
        return String(value);
    }
}

/** 入参展示：空对象时给个占位 */
function formatArgs(args: unknown): string {
    const text = formatValue(args);
    return text && text !== "{}" ? text : "无";
}

/**
 * 工具调用卡片
 * 头部固定展示工具名 + 入参，主体按 phase 原地切换：
 * - pending：运行中
 * - result：展示运行结果（后端工具 / 无 render 前端工具）
 * - executing：挂载工具自身的 render 组件（有 render 的前端工具）
 */
export default function UIToolCallPart(props: { part: ToolCallPart }) {
    const { part } = props;

    return (
        <span className="aui-chat-content-part aui-tool-call" data-phase={part.phase}>
            <span className="aui-tool-call-header">
                <span className="aui-tool-call-name">{part.name}</span>
                <span className="aui-tool-call-args">入参：{formatArgs(part.args)}</span>
            </span>

            <span className="aui-tool-call-body">
                {part.phase === "pending" && (
                    <span className="aui-tool-call-running">运行中…</span>
                )}

                {part.phase === "result" && (
                    <span className="aui-tool-call-result">
                        结果：{formatValue(part.result)}
                    </span>
                )}

                {part.phase === "executing" && part.render && (
                    <part.render
                        args={part.args}
                        result={part.result}
                        status={part.status}
                        uiResult={part.uiResult}
                        uiStatus={part.uiStatus}
                        call={part.call}
                    />
                )}
            </span>
        </span>
    );
}
