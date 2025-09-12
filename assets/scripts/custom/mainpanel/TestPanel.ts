import { _decorator, Component, Label, Node } from 'cc';
import { PanelComponent, PanelHideOption, PanelShowOption } from '../../framework/lib/router/PanelComponent';
import { qc } from '../../framework/qc';
import { PanelConfigs } from '../../configs/PanelConfigs';
const { ccclass, property } = _decorator;

export interface TestPanelData {
    test: string;
}

@ccclass('TestPanel')
export class TestPanel extends PanelComponent {
    @property(Label)
    testLabel: Label = null;

    show(option: PanelShowOption): void {
        option.onShowed();
        this.testLabel.string = (option.data as TestPanelData)?.test;
    }

    hide(option: PanelHideOption): void {
        option.onHided();
    }

    protected onEnable(): void {
        console.log('TestPanel onEnable-----------');

    }

    protected start(): void {
        console.log('TestPanel start-----------');
    }


    closeBtn() {
        qc.panelRouter.hide({
            panel: PanelConfigs.testPanel,
            onHided: () => {
                console.log('close test panel-----------');

            }
        });
    }
}


