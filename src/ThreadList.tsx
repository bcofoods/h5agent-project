import React, { useState } from "react";
import { ThreadList } from "@auipage/react";

export default function () {


    return (
        <ThreadList.Root>
            <ThreadList.New>
                新建会话
            </ThreadList.New>
            <ThreadList.Items>
                {({ thread }) => {
                    return <ThreadList.Item.Root>
                        <ThreadList.Item.Trigger>
                            <ThreadList.Item.Title>
                                {thread.title || "新会话"}
                            </ThreadList.Item.Title>
                        </ThreadList.Item.Trigger>
                        <ThreadList.Item.Archive>
                            归档
                        </ThreadList.Item.Archive>
                        <ThreadList.Item.UnArchive>
                            取消归档
                        </ThreadList.Item.UnArchive>
                        <ThreadList.Item.Delete>
                            删除
                        </ThreadList.Item.Delete>
                    </ThreadList.Item.Root>
                }}
            </ThreadList.Items>
        </ThreadList.Root>
    );
}
