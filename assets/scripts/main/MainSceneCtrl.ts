import { _decorator, Component, Node } from "cc";
import AssetLoader from "../../scripts/framework/lib/asset/AssetLoader";
import { qc } from "../framework/qc";
import { BundleConfigs } from "../configs/BundleConfigs";
import { PanelConfigs } from "../configs/PanelConfigs";

const { ccclass, property } = _decorator;

@ccclass
export default class MainSceneCtrl extends Component {
    @property(Node)
    rootLayerNode: Node = null;

    onLoad() {
        // 初始化面板路由器
        qc.panelRouter.init(this.rootLayerNode, true);
    }

    async start() {
        // 加载 Bundle
        await AssetLoader.loadBundle(BundleConfigs.bootBundle);
        await AssetLoader.loadBundle(BundleConfigs.commonBundle);
        await AssetLoader.loadBundle(BundleConfigs.audioBundle);
        await AssetLoader.loadBundle(BundleConfigs.gameBundle);
        await AssetLoader.loadBundle(BundleConfigs.mainBundle);

        // 加载启动页
        await qc.panelRouter.loadAsync(PanelConfigs.bootPanel);

        // 打开启动页
        qc.panelRouter.show({
            panel: PanelConfigs.bootPanel,
        });
    }
}
