import { MessageHistoryAdapter } from "@auipage/react";
import { $remote } from "./tool";

// 对话内容历史
export default new MessageHistoryAdapter({

    // 加载历史消息
    async load(threadId) {
        return $remote.get(`/api/threads/${threadId}/messages`) as any;
    },

    // 新增消息入库
    async append(threadId, messages) {
        return $remote.post(`/api/threads/${threadId}/messages`, messages) as any;
    }

});