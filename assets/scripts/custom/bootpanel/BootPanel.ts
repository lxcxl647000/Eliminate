import { _decorator, ProgressBar } from "cc";
import { PanelComponent, PanelHideOption, PanelShowOption } from "../../framework/lib/router/PanelComponent";
import { PanelConfigs } from "../../configs/PanelConfigs";
import { qc } from "../../framework/qc";

const { ccclass, property } = _decorator;

/**
 * 启动页面板
 *
 */
@ccclass
export default class BootPanel extends PanelComponent {
    @property(ProgressBar)
    loadingProgressBar: ProgressBar = null;

    show(option: PanelShowOption): void {
        option.onShowed();
        this._initGame();
    }

    hide(option: PanelHideOption): void {
        option.onHided();
    }

    private async _initGame() {

        this._onLoadProgressChanged(0.5, "加载游戏资源...");
        await qc.panelRouter.loadAsync(PanelConfigs.mainPanel);

        // 打开主界面
        this._onLoadProgressChanged(1.0);
        qc.panelRouter.show({
            panel: PanelConfigs.mainPanel,
            onShowed: () => {
                // 主界面打开完毕之后，隐藏并清理启动页面板相关资源（因为后续不会在用到）
                qc.panelRouter.hide({
                    panel: PanelConfigs.bootPanel,
                    onHided: () => {
                        qc.panelRouter.destroy({
                            panel: PanelConfigs.bootPanel,
                        });
                    },
                });
            },
        });
    }

    /**
     * 加载进度更新
     *
     * @param pb 加载进度 [0, 1]
     * @param msg 加载描述信息
     */
    private _onLoadProgressChanged(pb: number, msg: string = null) {
        this.loadingProgressBar.progress = pb;
    }
}
