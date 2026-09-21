import { fetch } from "@auipage/fetch";

let doit = (url: string, method: string, data?: any) => {
    return new Promise(function (resolve, reject) {

        let options: any = {
            url,
            method,
            headers: {
                "Content-Type": "application/json",
            }
        };

        if (data) options.body = JSON.stringify(data);

        fetch(options).then(res => {
            let data = "";
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve(JSON.parse(data));
            });
        });
    });
};

export let $remote = {
    get(url: string) {
        return doit(url, "GET");
    },
    post(url: string, data?: any) {
        return doit(url, "POST", data);
    },
    patch(url: string, data?: any) {
        return doit(url, "PATCH", data);
    },
    delete(url: string) {
        return doit(url, "DELETE");
    }
};