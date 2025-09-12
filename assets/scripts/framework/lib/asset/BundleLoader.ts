import { Asset, AssetManager, SceneAsset } from "cc";

/**
 * 提供 Promise 写法的 Bundler 加载器，但是这种写法会缺失加载进度
 *
 */
export default class BundleLoader {
    static load<T extends Asset>(bundle: AssetManager.Bundle, path: string, type?: typeof Asset): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            bundle.load(path, type, (error: Error, asset: T) => {
                error ? reject(error) : resolve(asset);
            });
        });
    }

    static loadDir<T extends Asset>(bundle: AssetManager.Bundle, dirPath: string, type?: typeof Asset): Promise<Array<T>> {
        return new Promise<Array<T>>((resolve, reject) => {
            bundle.loadDir(dirPath, type, (error: Error, asset: Array<T>) => {
                error ? reject(error) : resolve(asset);
            });
        });
    }

    static loadScene(bundle: AssetManager.Bundle, sceneName: string, options?: Record<string, any>) {
        return new Promise<SceneAsset>((resolve, reject) => {
            bundle.loadScene(sceneName, options, (error: Error, asset: SceneAsset) => {
                error ? reject(error) : resolve(asset);
            });
        });
    }
}
