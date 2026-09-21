import { ChatTransportAdapter, generator } from "@auipage/react";
import { fetch } from "@auipage/fetch";
import { $remote } from "./tool";

// 定义对话连接
export default new ChatTransportAdapter({

    /**
     * @param messages - 聊天消息历史数组
     * @param context - 比如context.tools可用的工具对象集合等
     */
    // https://zxl20070701.github.io/notebook/index.html#/program/language/javascript/grammar/iterator-generator
    async *run({ messages, context }): any {

        // 开启一场新的对话以后，虽然还是原来的对话界面，但历史消息应该进行预处理，而不是直接使用原始消息
        // console.log("本对话的历史消息", context.history);

        // 显示思考状态
        yield { type: "loading", text: "思考中..." };

        yield* generator(function (callYield, callEnd, callError) {
            fetch({
                url: "/api/chat",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages,
                    tools: context.tools
                })
            }).then(res => {

                res.on('data', payload => {
                    let data = JSON.parse(payload);
                    callYield(data);
                });

                res.on('end', () => {
                    callEnd()
                });

                res.on('error', callError);

            }).catch(callError);
        });

    },

    // 响应智能体请求
    // 对于工具执行结果 name = "tool-result"
    response(name, data) {
        return $remote.post(`/api/chat/${name}`, data);
    }

});