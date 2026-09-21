import React from "react";

/** 思考片段 */
export default function UIThinkingPart(props: { children?: React.ReactNode }) {
    return (
        <span className="aui-chat-content-part aui-chat-content-part-thinking">
            {props.children}
        </span>
    );
}
