import React from "react";

/** 文本片段：沿用 aui-chat-content-part 基础类承载气泡样式 */
export default function UITextPart(props: { children?: React.ReactNode }) {
    return (
        <span className="aui-chat-content-part aui-chat-content-part-text">
            {props.children}
        </span>
    );
}
