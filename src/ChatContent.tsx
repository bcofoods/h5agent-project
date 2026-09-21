import React from "react";
import { ChatContent } from "@auipage/react";

import UITextPart from "./parts/UITextPart";
import UILoadingPart from "./parts/UILoadingPart";
import UIThinkingPart from "./parts/UIThinkingPart";
import UIToolCallPart from "./parts/UIToolCallPart";

export default function () {
    return (
        <ChatContent.Root>
            <ChatContent.Viewport>
                <ChatContent.Messages>
                    {() => {
                        return (
                            <ChatContent.Parts>
                                {({ part }) => {
                                    if (part.type === "text") {
                                        return <UITextPart>{part.text}</UITextPart>;
                                    }
                                    if (part.type === "loading") {
                                        return <UILoadingPart>{part.text}</UILoadingPart>;
                                    }
                                    if (part.type === "thinking") {
                                        return <UIThinkingPart>{part.text}</UIThinkingPart>;
                                    }
                                    if (part.type === "tool-call") {
                                        return <UIToolCallPart part={part} />;
                                    }
                                    return null;
                                }}
                            </ChatContent.Parts>
                        );
                    }}
                </ChatContent.Messages>
            </ChatContent.Viewport>
            <ChatContent.Composer.Root>
                <ChatContent.Composer.Input />
                <ChatContent.Composer.Send>
                    发送
                </ChatContent.Composer.Send>
            </ChatContent.Composer.Root>
        </ChatContent.Root>
    );
}
