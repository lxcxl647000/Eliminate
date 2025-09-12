import { sys } from "cc";
import { qc } from "../../qc";
import { LocalStorageInterface } from "./LocalStorageInterface";

/**
 * 本地存储管理
 *
 */
export class LocalStorage implements LocalStorageInterface {
    /**
     * 读取指定key值的记录
     *
     * @param key 读取记录key
     */
    getItem(key: string): string {
        let value = sys.localStorage.getItem(key);
        console.log("LocalStorage", "get", key, value);
        return value;
    }

    /**
     * 设置指定key值的记录
     *
     * @param key 待保存key（会覆盖现有的）
     * @param value 待保存value
     */
    setItem(key: string, value: string): void {
        console.log("LocalStorage", "set", key, value);
        sys.localStorage.setItem(key, value);
    }

    /**
     * 移除指定key值
     *
     * @param key 待移除key
     */
    removeItem(key: string) {
        sys.localStorage.removeItem(key);
    }
}
