import { sys } from "cc";
import adapter_interface from "./adapter_interface";


/**
 * 引擎适配文件
 */
export default class adapter_cocos implements adapter_interface {
    public onTaobao(): boolean {
        return sys.platform === sys.Platform.TAOBAO_MINI_GAME && !globalThis['my'];
    }
}