import { _decorator, Component, Node } from 'cc';
import { PanelComponent, PanelHideOption, PanelShowOption } from '../../framework/lib/router/PanelComponent';
import { qc } from '../../framework/qc';
import { PanelConfigs } from '../../configs/PanelConfigs';
import { TestPanelData } from './TestPanel';
const { ccclass, property } = _decorator;

@ccclass('MainPanel')
export class MainPanel extends PanelComponent {
    show(option: PanelShowOption): void {
        option.onShowed();
    }
    hide(option: PanelHideOption): void {

    }


    testBtn() {
        qc.panelRouter.showPanel({
            panel: PanelConfigs.testPanel,
            onShowed: () => {
                console.log('this is a test-----');
            },
            data: <TestPanelData>{ test: "test" },
        });
    }

    testBtn2() {
        qc.panelRouter.showPanel({
            panel: PanelConfigs.gamePanel,
            onShowed: () => {

            },
        });
    }
}


