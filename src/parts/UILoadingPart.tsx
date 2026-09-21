import React from "react";

/** 加载片段 */
export default function UILoadingPart(props: { children?: React.ReactNode }) {
    return (
        <span className="aui-chat-content-part aui-chat-content-part-loading">
            {props.children}
        </span>
    );
}
