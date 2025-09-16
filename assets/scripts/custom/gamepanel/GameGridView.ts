import { _decorator, Component, Node, Prefab, Vec2, EventTouch, instantiate, v2, tween, Tween, UITransform, v3 } from 'cc';
import { CELL_WIDTH, CELL_HEIGHT, GRID_PIXEL_WIDTH, GRID_PIXEL_HEIGHT, ANITIME } from '../../game/Model/ConstValue';
import GamePanel from './GamePanel';
import { GameCellView } from './GameCellView';
import GameCellModel, { Command } from '../../game/Model/GameCellModel';
import { GameEffectLayer } from './GameEffectLayer';

const { ccclass, property } = _decorator;

interface ViewInfo {
    view: Node;
    x: number;
    y: number;
}

interface ModelCommand {
    cmd: Command[];
}

@ccclass('GameGridView')
export default class GameGridView extends Component {
    @property([Prefab])
    aniPre: Prefab[] = [];

    @property(GameEffectLayer)
    effectLayer: GameEffectLayer = null;

    private gamePanel: GamePanel;
    private cellViews: Node[][] = [];
    private lastTouchPos: Vec2 = null;
    private isCanMove: boolean = true;
    private isInPlayAni: boolean = false;

    onLoad() {
        this.setListener();
        this.lastTouchPos = v2(-1, -1);
        this.isCanMove = true;
        this.isInPlayAni = false;
    }

    setController(controller: GamePanel) {
        this.gamePanel = controller;
    }

    initWithCellModels(cellsModels: GameCellModel[][]) {
        this.cellViews = [];
        for (let i = 1; i <= 9; i++) {
            this.cellViews[i] = [];
            for (let j = 1; j <= 9; j++) {
                const type = cellsModels[i][j].type;
                const aniView = instantiate(this.aniPre[type]);
                aniView.parent = this.node;
                const cellViewScript = aniView.getComponent(GameCellView);
                cellViewScript.initWithModel(cellsModels[i][j]);
                this.cellViews[i][j] = aniView;
            }
        }
    }

    setListener() {
        this.node.on(Node.EventType.TOUCH_START, (eventTouch: EventTouch) => {
            if (this.isInPlayAni) {
                return;
            }

            const touchPos = eventTouch.getLocation();
            const cellPos = this.convertTouchPosToCell(touchPos);

            if (cellPos) {
                const changeModels = this.selectCell(cellPos);
                this.isCanMove = changeModels.length < 3;
            } else {
                this.isCanMove = false;
            }
        }, this);

        this.node.on(Node.EventType.TOUCH_MOVE, (eventTouch: EventTouch) => {
            if (this.isCanMove) {
                const startTouchPos = eventTouch.getStartLocation();
                const startCellPos = this.convertTouchPosToCell(startTouchPos);
                const touchPos = eventTouch.getLocation();
                const cellPos = this.convertTouchPosToCell(touchPos);

                if (startCellPos.x !== cellPos.x || startCellPos.y !== cellPos.y) {
                    this.isCanMove = false;
                    this.selectCell(cellPos);
                }
            }
        }, this);

        this.node.on(Node.EventType.TOUCH_END, () => {
            // console.log("Touch ended");
        }, this);

        this.node.on(Node.EventType.TOUCH_CANCEL, () => {
            // console.log("Touch canceled");
        }, this);
    }

    convertTouchPosToCell(pos: Vec2): Vec2 | null {
        const nodePos = this.node.getComponent(UITransform)?.convertToNodeSpaceAR(v3(pos.x, pos.y));
        if (!nodePos) return null;

        if (nodePos.x < 0 || nodePos.x >= GRID_PIXEL_WIDTH ||
            nodePos.y < 0 || nodePos.y >= GRID_PIXEL_HEIGHT) {
            return null;
        }

        const x = Math.floor(nodePos.x / CELL_WIDTH) + 1;
        const y = Math.floor(nodePos.y / CELL_HEIGHT) + 1;

        return v2(x, y);
    }


    updateView(changeModels: GameCellModel[]) {
        const newCellViewInfo: { model: GameCellModel, view: Node }[] = [];

        for (const model of changeModels) {
            const viewInfo = this.findViewByModel(model);
            let view: Node = null;

            if (!viewInfo) {
                const type = model.type;
                const aniView = instantiate(this.aniPre[type]);
                aniView.parent = this.node;
                const cellViewScript = aniView.getComponent(GameCellView);
                cellViewScript.initWithModel(model);
                view = aniView;
            } else {
                view = viewInfo.view;
                this.cellViews[viewInfo.y][viewInfo.x] = null;
            }

            const cellScript = view.getComponent(GameCellView);
            cellScript.updateView();

            if (!model.isDeath) {
                newCellViewInfo.push({
                    model: model,
                    view: view
                });
            }
        }

        newCellViewInfo.forEach(ele => {
            const model = ele.model;
            this.cellViews[model.y][model.x] = ele.view;
        });
    }

    updateSelect(pos: Vec2) {
        for (let i = 1; i <= 9; i++) {
            for (let j = 1; j <= 9; j++) {
                if (this.cellViews[i][j]) {
                    const cellScript = this.cellViews[i][j].getComponent(GameCellView);
                    if (pos.x === j && pos.y === i) {
                        cellScript.setSelect(true);
                    } else {
                        cellScript.setSelect(false);
                    }
                }
            }
        }
    }

    findViewByModel(model: GameCellModel): ViewInfo | null {
        for (let i = 1; i <= 9; i++) {
            for (let j = 1; j <= 9; j++) {
                if (this.cellViews[i][j] &&
                    this.cellViews[i][j].getComponent(GameCellView).model === model) {
                    return {
                        view: this.cellViews[i][j],
                        x: j,
                        y: i
                    };
                }
            }
        }
        return null;
    }

    getPlayAniTime(changeModels: ModelCommand[]): number {
        if (!changeModels) {
            return 0;
        }

        let maxTime = 0;
        changeModels.forEach(ele => {
            ele.cmd.forEach(cmd => {
                if (maxTime < cmd.playTime + cmd.keepTime) {
                    maxTime = cmd.playTime + cmd.keepTime;
                }
            });
        });

        return maxTime;
    }

    getStep(effectsQueue: Command[]): number {
        if (!effectsQueue) {
            return 0;
        }

        return effectsQueue.reduce((maxValue, effectCmd) => {
            return Math.max(maxValue, effectCmd.step || 0);
        }, 0);
    }

    disableTouch(time: number, step: number) {
        if (time <= 0) {
            return;
        }

        this.isInPlayAni = true;

        tween(this.node)
            .delay(time)
            .call(() => {
                this.isInPlayAni = false;
            })
            .start();
    }

    selectCell(cellPos: Vec2): any[] {
        const result = this.gamePanel.selectCell(cellPos);
        const changeModels = result[0];
        const effectsQueue = result[1];

        this.playEffect(effectsQueue);
        this.disableTouch(this.getPlayAniTime(changeModels), this.getStep(effectsQueue));
        this.updateView(changeModels);
        this.gamePanel.cleanCmd();

        if (changeModels.length >= 2) {
            this.updateSelect(v2(-1, -1));
        } else {
            this.updateSelect(cellPos);
        }

        return changeModels;
    }

    playEffect(effectsQueue: Command[]) {
        if (this.effectLayer) {
            this.effectLayer.playEffects(effectsQueue);
        }
    }
}