import { Base64 } from "js-base64";
import { hexMD5 } from "./utils/md5";
import { baseConfig } from "../../../configs/baseConfig";
interface ResponseData<T> {
    code: number;
    msg: string;
    data: T;
}
export class httpMgr {
    private static _ins: httpMgr = null;

    public static get ins() {
        if (this._ins == null) {
            this._ins = new httpMgr();
        }
        return this._ins;
    }

    public async xhrRequest<T>(api: string, method: string = 'GET', data?: any): Promise<ResponseData<T>> {
        return new Promise<ResponseData<T>>((resolve, reject) => {
            let url = baseConfig.baseUrl + api;
            if (data) {
                url += '?';
                let index = 0;
                for (let key in data) {
                    if (index == 0) {
                        url += `${key}=${data[key]}`;
                        index++;
                    }
                    else {
                        url += `&${key}=${data[key]}`;
                    }
                }
            }

            let timestamp = parseInt((Date.now() / 1000).toString()).toString();
            let nonce = Math.ceil(Math.random() * 10000) + '';
            let token = baseConfig.token;

            let params = {
                appid: baseConfig.appid,
                nonce: nonce,
                timestamp: timestamp,
                os: '',
                v: baseConfig.apiVersion,
                token: token,
                _url: baseConfig.baseUrl + api
            };
            if (data) {
                Object.assign(params, data);
                params.appid = baseConfig.appid;
            }

            let signStr = '';
            Object.keys(params)
                .sort()
                .forEach(function (key) {
                    if (typeof params[key] != 'undefined') {
                        signStr += key + params[key];
                    }
                });
            let sign = hexMD5(Base64.encode(signStr));

            let xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.timeout = 5000;
            xhr.setRequestHeader("adzone-id", baseConfig.adzoneId);
            xhr.setRequestHeader("cache-control", 'no-cache');
            xhr.setRequestHeader("content-type", 'application/x-www-form-urlencoded');
            xhr.setRequestHeader("os", '');
            xhr.setRequestHeader("appid", params.appid);
            xhr.setRequestHeader("nonce", nonce);
            xhr.setRequestHeader("v", params.v);
            xhr.setRequestHeader("timestamp", timestamp);
            xhr.setRequestHeader("token", token);
            xhr.setRequestHeader("sign", sign);

            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    let res = JSON.parse(xhr.responseText);
                    console.log('responseText : ' + api, res);
                    if (res.code === 200) {
                        resolve(res);
                    }
                    else {
                        resolve(null);
                    }
                }
            };
            xhr.onerror = () => {
                console.log('Request error');
                reject();
            };
            xhr.ontimeout = () => {
                console.log('Request timeout');
                reject();
            };

            xhr.send();
        });
    }
}