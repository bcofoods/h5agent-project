let headers = {
    'Access-Control-Allow-Origin': '*',
    'Server': 'Powered by auipage',
    'Content-type': 'application/javascript;charset=utf-8'
};

export default {
    test: /^\/api\/threads/,
    handler: function (req, res) {

        if (req.url === "/api/threads") {

            // 查询会话列表
            if (req.method === "GET") {
                res.writeHead('200', headers);
                res.write(JSON.stringify(globalThis.threadsList));
                res.end();
            }

            // 新增新会话
            else if (req.method === "POST") {
                let postData = ""
                req.on('data', (chunk) => { postData += chunk; });
                req.on('end', () => {
                    const data = JSON.parse(postData);

                    let title = "新会话";
                    try {
                        title = data.messages[0].content[0].text
                    } catch (e) { }

                    let thread = {
                        threadId: new Date().valueOf() + "",
                        title,
                        status: "regular",
                    };

                    globalThis.threadsList.unshift(thread);
                    globalThis.messagesMap[thread.threadId] = [];

                    res.writeHead('200', headers);
                    res.write(JSON.stringify(thread));
                    res.end();
                });
            }
        }

        else if (/^\/api\/threads\/[^\/]+\/messages/.test(req.url)) {

            let threadId = req.url.split("/")[3];

            // 查询会话消息
            if (req.method === "GET") {
                res.writeHead('200', headers);
                res.write(JSON.stringify(globalThis.messagesMap[threadId]));
                res.end();
            }

            // 新增会话消息
            else if (req.method === "POST") {
                let postData = ""
                req.on('data', (chunk) => { postData += chunk; });
                req.on('end', () => {
                    const data = JSON.parse(postData);

                    globalThis.messagesMap[threadId].push(data);
                    res.writeHead('200', headers);
                    res.write(JSON.stringify({ success: true }));
                    res.end();
                });
            }

        }

        else if (/^\/api\/threads\/[^\/]+/.test(req.url)) {
            let threadId = req.url.split("/")[3];

            // 修改会话内容
            if (req.method === "PATCH") {
                let postData = ""
                req.on('data', (chunk) => { postData += chunk; });
                req.on('end', () => {
                    const data = JSON.parse(postData);

                    for (let index = 0; index < globalThis.threadsList.length; index++) {
                        if (globalThis.threadsList[index].threadId === threadId) {
                            for (let key in data) {
                                globalThis.threadsList[index][key] = data[key];
                            }
                            break;
                        }
                    }

                    res.writeHead('200', headers);
                    res.write(JSON.stringify({ success: true }));
                    res.end();
                });
            }

            // 删除会话
            else if (req.method === "DELETE") {
                for (let index = 0; index < globalThis.threadsList.length; index++) {
                    if (globalThis.threadsList[index].threadId === threadId) {
                        globalThis.threadsList.splice(index, 1);
                        break;
                    }
                }
                delete globalThis.messagesMap[threadId];

                res.writeHead('200', headers);
                res.write(JSON.stringify({ success: true }));
                res.end();
            }
        }

    }
};