import { assetManager, AssetManager } from "cc";

/**
 * 提供 Promise 写法的 cc.assetManager 加载器，但是这种写法会缺失加载进度
 *
 */
export default class AssetLoader {
    static loadBundle(bundleName: string): Promise<AssetManager.Bundle> {
        return new Promise<AssetManager.Bundle>((resolve, reject) => {
            assetManager.loadBundle(bundleName, (error: Error, bundle: AssetManager.Bundle) => {
                error ? reject(error) : resolve(bundle);
            });
        });
    }
}
