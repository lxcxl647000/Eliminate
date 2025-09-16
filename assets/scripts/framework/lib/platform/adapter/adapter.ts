import adapter_cocos from "./adapter_cocos";
import adapter_interface from "./adapter_interface";

/**
 * 引擎适配文件
 */
export default class adapter implements adapter_interface {
    private _adapter: adapter_interface = new adapter_cocos();
    private static _inst: adapter;
    public static get inst(): adapter_interface {
        if (this._inst == null) {
            this._inst = new adapter();
        }
        return this._inst;
    }

    onTaobao(): boolean {
        return this._adapter.onTaobao();
    }
}