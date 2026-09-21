import { Agent, CreateTool } from "@auipage/agent";
import { MessageStream } from "@auipage/core";
import readPlain from "./readPlain.js";

export default {
    test: /^\/api\/chat/,
    handler: function (req, res) {
        if (req.method === "POST") {

            // 新任务
            if (req.url === "/api/chat") {

                // 和页面的消息发送对象
                let ms = new MessageStream(function (data) {
                    res.write("data: " + JSON.stringify(data) + "\n\n");
                }, function () {
                    res.end();
                });

                let ct = new CreateTool(ms);

                let postData = ""
                req.on('data', (chunk) => { postData += chunk; });
                req.on('end', () => {
                    const data = JSON.parse(postData);
                    res.writeHead('200', {
                        'Access-Control-Allow-Origin': '*',
                        'Server': 'Powered by auipage',
                        'Content-type': 'text/event-stream;charset=utf-8'
                    });

                    new Agent({
                        stream: true,
                        model: {
                            baseURL: "http://localhost:11434/v1",
                            apiKey: "",
                            model: "qwen3.5",
                        },

                        // ct.create是一个用于创建工具的函数
                        // 只适合@auipage/agent使用
                        // 其余智能体需要自己实现工具的创建
                        tools: [

                            // 后端工具
                            ct.create(readPlain),

                            // 前端工具
                            ...data.tools.map((tool) => ct.create(tool))
                        ],
                        systemPrompt: "如果可以，请尽力用showPlain工具显示文本文件内容",
                    }).generate(data.messages, void 0, function thinkback(text) {
                        ms.send({
                            type: "thinking",
                            text,
                        });
                    }).then(function (result) {
                        ms.send({
                            type: "text",
                            text: result,
                        });
                        ms.end();
                    });

                });

            }

            // 前端工具调用相应
            else if (req.url === "/api/chat/tool-result") {
                let postData = ""
                req.on('data', (chunk) => { postData += chunk; });
                req.on('end', () => {
                    const data = JSON.parse(postData);
                    if (globalThis[data.id]) {
                        globalThis[data.id](data.result);
                        delete globalThis[data.id];
                    }

                    res.writeHead('200', {
                        'Access-Control-Allow-Origin': '*',
                        'Server': 'Powered by auipage',
                        'Content-type': 'application/javascript;charset=utf-8'
                    });
                    res.write(JSON.stringify({ success: true }));
                    res.end();
                });
            }
        }
    }
};