import { serve } from "@oipage/cli";
import registerChatRoute from "./chat.js";
import registerThreadsRoute from "./threads.js";

// 对话列表
globalThis.threadsList = [{
    threadId: "003",
    title: "今天天气怎么样？",
    status: "regular",
}, {
    threadId: "002",
    title: "晚饭应该吃什么？",
    // status: "regular", // 常规 / 正常
    status: "archived", // 已归档
}, {
    threadId: "001",
    title: "喝奶粉的正确姿势",
    status: "regular",
}];

// 对话内容
globalThis.messagesMap = {
    "003": [{
        messages: [{
            role: "user",
            content: [{
                type: "text",
                text: "今天天气怎么样？"
            }]
        }, {
            role: "assistant",
            content: [{
                type: "text",
                text: "今天天气晴朗，温度25摄氏度"
            }]
        }]
    }, {
        messages: [{
            role: "user",
            content: [{
                type: "text",
                text: "你是谁？"
            }]
        }, {
            role: "assistant",
            content: [{
                type: "text",
                text: "我是一个智能体，可以帮你回答一些日常问题，欢迎向我提问！"
            }]
        }]
    }],
    "002": [{
        messages: [{
            role: "user",
            content: [{
                type: "text",
                text: "晚饭应该吃什么？"
            }]
        }, {
            role: "assistant",
            content: [{
                type: "text",
                text: "晚饭应该吃鱼香肉丝"
            }]
        }]
    }],
    "001": [{
        messages: [{
            role: "user",
            content: [{
                type: "text",
                "text": "喝奶粉的正确姿势"
            }]
        }, {
            role: "assistant",
            content: [{
                type: "text",
                text: "不要用太热的水，这样不好"
            }]
        }]
    }]
};

// 启动开发服务器
serve({
    name: "auipage",
    devServer: {
        port: 30000,
        baseUrl: "./",
        open: false,
        cache: false,
        intercept: [registerChatRoute, registerThreadsRoute]
    }
});