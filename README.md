# [h5agent-project](https://github.com/bcofoods/h5agent-project)
H5版本的智能体开发原型

## 如何使用？

### 环境准备

- Node.js（建议 18 及以上）
- 一个兼容 OpenAI 接口的模型服务。开发模式下默认连接本地 `http://localhost:11434/v1` 的 `qwen3.5` 模型（Ollama），如需调整请修改 [server/chat.js](server/chat.js) 中的 `model` 配置。

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

该命令会同时启动 `@oipage/cli` 后端服务（默认端口 `30000`，提供 `/api/chat`、`/api/threads` 等接口）和 Vite 前端开发服务，浏览器打开提示的本地地址即可看到会话界面。

### 生产构建

```bash
npm run build
```

构建产物由 Vite 输出，可部署到任意静态资源服务器。

### 项目结构

```
h5agent-project/
├── index.html               # 页面入口
├── server/                  # 本地后端（基于 @oipage/cli）
│   ├── index.js             # 注册路由、注入示例会话数据
│   ├── chat.js              # /api/chat 流式对话接口
│   ├── threads.js           # /api/threads 会话与消息 CRUD
│   └── readPlain.js         # 后端工具：读取并展示文本文件
├── src/
│   ├── index.tsx            # 应用入口，挂载 AuiRuntimeProvider
│   ├── ChatContent.tsx      # 聊天主区域（含输入框）
│   ├── ThreadList.tsx       # 会话列表面板
│   ├── adapter/             # 与后端交互的适配器（对话传输、消息历史、会话列表）
│   ├── parts/               # 各种消息片段的自定义渲染组件
│   └── tools/               # 前端工具集合（getBrowserTime、askFavoriteFruit）
└── package.json
```

### 体验示例工具

启动后可以在对话框中尝试：

- 输入"现在几点了？"让智能体调用 `getBrowserTime` 获取浏览器当前时间。
- 输入"你喜欢什么水果？"让智能体调用 `askFavoriteFruit` 弹出可交互的水果选择面板。
- 直接发送一段文本，让后端 `readPlain` 工具读取并展示其内容（可在 [server/chat.js](server/chat.js) 的 `systemPrompt` 中调整触发偏好）。

新增前端工具只需在 [src/tools/](src/tools/) 下使用 `defineTool` 定义，并在 [src/tools/index.ts](src/tools/index.ts) 中导出即可被自动注入到 `AuiRuntimeProvider`。

### 前端工具调用示例

前端工具由 `@auipage/react` 通过 `AuiRuntimeProvider` 注册，工具的 `execute` 在浏览器侧运行，结果再回传给模型。下面给出仓库内置的两种典型范式。

#### 1. `getBrowserTime`：纯前端工具，无 UI 渲染

源码：[src/tools/getBrowserTime.ts](src/tools/getBrowserTime.ts)

```ts
import { defineTool } from "@auipage/react";

export default defineTool({
    name: "getBrowserTime",
    description: "获取当前浏览器所在设备的本地日期与时间",
    parameters: {
        type: "object",
        properties: {},
        required: [],
    },
    execute() {
        return new Date().toLocaleString();
    },
});
```

**调用流程：**

1. 用户在 [src/ChatContent.tsx](src/ChatContent.tsx) 输入"现在几点了？"并发送。
2. [src/adapter/chatTransport.ts](src/adapter/chatTransport.ts) 把 `messages` 与 `context.tools`（来自 `AuiRuntimeProvider` 注入的工具集合）通过 SSE 推送到 `/api/chat`。
3. [server/chat.js](server/chat.js) 调用 `@auipage/agent` 的 `Agent.generate`，模型判定需要调用 `getBrowserTime`。
4. `ChatTransportAdapter.response('tool-result', { id, result })` 把 `execute()` 返回的字符串（即 `new Date().toLocaleString()`）回传给后端。
5. 工具调用卡片 [src/parts/UIToolCallPart.tsx](src/parts/UIToolCallPart.tsx) 在 `phase === "result"` 时直接展示该字符串，模型据此生成最终回复（例如"现在浏览器时间是 2026/9/22 21:18:00"）。

#### 2. `askFavoriteFruit`：带交互渲染的前端工具

源码：[src/tools/askFavoriteFruit.tsx](src/tools/askFavoriteFruit.tsx)

```tsx
import React from "react";
import { defineTool } from "@auipage/react";
import type { ToolRenderProps } from "@auipage/react";

const FRUITS = ["苹果", "香蕉", "橙子", "葡萄", "西瓜"];

function AskFavoriteFruitRender(props: ToolRenderProps) {
    const { call, uiResult, result, status } = props;

    if (!call) {
        return <span>已选择：{String(uiResult)}</span>;
    }

    const fruits: string[] = status === "success" && Array.isArray(result) ? result : [];

    return (
        <div className="fruit-picker">
            <div>请选择你喜欢的水果：</div>
            <div>
                {fruits.map((fruit) => (
                    <button key={fruit} type="button" onClick={() => call(fruit)}>
                        {fruit}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default defineTool({
    name: "askFavoriteFruit",
    description: "当需要了解用户喜欢什么水果时使用，会弹窗询问用户并返回所选水果",
    parameters: {
        type: "object",
        properties: {},
        required: [],
    },
    execute() {
        return FRUITS;
    },
    render: AskFavoriteFruitRender,
});
```

**调用流程：**

1. 用户输入"你喜欢什么水果？"。
2. 模型判定需要调用 `askFavoriteFruit`，前端先执行 `execute()` 拿到候选列表（`["苹果","香蕉","橙子","葡萄","西瓜"]`）。
3. 工具调用进入 `phase === "executing"`，[src/parts/UIToolCallPart.tsx](src/parts/UIToolCallPart.tsx) 挂载工具自带的 `render` 组件，渲染 5 个按钮。
4. 用户点击按钮（例如"橙子"），`call("橙子")` 把 `uiResult` 回传给后端，模型据此继续生成回复。
5. 历史消息中再次查看该工具调用时，`call` 不存在，`render` 走只读分支显示"已选择：橙子"。

#### 自定义一个前端工具

例如新增 `src/tools/getCurrentLocation.ts`：

```ts
import { defineTool } from "@auipage/react";

export default defineTool({
    name: "getCurrentLocation",
    description: "获取当前浏览器所在的地理位置（经纬度）",
    parameters: {
        type: "object",
        properties: {},
        required: [],
    },
    async execute() {
        return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                }),
                reject,
            );
        });
    },
});
```

然后在 [src/tools/index.ts](src/tools/index.ts) 中追加导出：

```ts
import getBrowserTime from "./getBrowserTime";
import askFavoriteFruit from "./askFavoriteFruit";
import getCurrentLocation from "./getCurrentLocation";

export default [getBrowserTime, askFavoriteFruit, getCurrentLocation];
```

无需改动其他文件，`AuiRuntimeProvider` 会自动把新工具纳入 `context.tools`，模型即可在需要时调用。