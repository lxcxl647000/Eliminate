import cloud from '@tbmp/mp-cloud-sdk';
import { baseConfig } from '../../../configs/baseConfig';

export class tbCloudMgr {
    private static _instance: tbCloudMgr;
    private _cloudObject = null;
    public static get ins() {
        if (!tbCloudMgr._instance) {
            tbCloudMgr._instance = new tbCloudMgr();
        }
        return tbCloudMgr._instance;
    }
    public init() {
        console.log('appid : === ' + baseConfig.appid);
        if (!this._cloudObject && cloud['Cloud']) {
            this._cloudObject = new cloud['Cloud']();
            try {
                this._cloudObject.init({
                    env: 'online'
                });
                this.getToken();
            } catch (e) {
                console.error("cloud初始化错误：" + e);
            }
        }
        else {
            this.getToken();
        }
    }
    async getToken() {
        console.log("cloud对象:", JSON.stringify(this._cloudObject, null, 2));
        console.log("application对象:", JSON.stringify(this._cloudObject.application, null, 2));
        const config = {
            path: '/TaoBaoCallback/happyCatchingCatBack',
            method: 'GET',
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            params: {
                name: "hanruo",
                action: "test"
            },
            exts: {
                cloudAppId: "57216",
                timeout: 4000,
                domain: baseConfig.emptyAppDomain
            }
        };
        console.log("请求配置:", JSON.stringify(config, null, 2));
        try {
            const result = await this._cloudObject.application.httpRequest(config);
            console.log("请求结果:", JSON.stringify(result, null, 2));
            let res = JSON.parse(result);
            console.log('userid : === ' + res.user_id);
            baseConfig.token = res.token;
            baseConfig.userId = res.user_id;
        } catch (error) {
            console.error("请求失败:", error);
        }
    }
}