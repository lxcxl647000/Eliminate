import { _decorator, Component, Node, SpriteFrame, Sprite, Animation, Vec2, Vec3, tween, Tween, UIOpacity } from 'cc';
import { CELL_STATUS, CELL_WIDTH, CELL_HEIGHT, ANITIME } from '../../game/Model/ConstValue';
import GameCellModel from '../../game/Model/GameCellModel';
const { ccclass, property } = _decorator;

interface CommandAction {
    action: string;
    playTime: number;
    keepTime: number;
    pos?: Vec2;
    isVisible?: boolean;
}

@ccclass('GameCellView')
export class GameCellView extends Component {

    @property(SpriteFrame)
    defaultFrame: SpriteFrame = null;

    private _model: GameCellModel = null;
    public get model(): GameCellModel {
        return this._model;
    }

    private isSelect: boolean = false;

    onLoad() {
        this.isSelect = false;
    }

    initWithModel(model: GameCellModel): void {
        this._model = model;
        const x = model.startX;
        const y = model.startY;
        this.node.setPosition(CELL_WIDTH * (x - 0.5), CELL_HEIGHT * (y - 0.5));
        const animation = this.node.getComponent(Animation);

        if (model.status === CELL_STATUS.COMMON) {
            animation.stop();
        } else {
            animation.play(model.status);
        }
    }

    updateView(): void {
        const cmd = this._model.cmd;
        if (cmd.length <= 0) {
            return;
        }

        let tweenChain: Tween<Node> = null;
        let curTime = 0;

        for (const actionCmd of cmd) {
            if (actionCmd.playTime > curTime) {
                const delayTime = actionCmd.playTime - curTime;
                if (tweenChain) {
                    tweenChain = tweenChain.delay(delayTime * 1000);
                } else {
                    tweenChain = tween(this.node).delay(delayTime * 1000);
                }
            }

            if (actionCmd.action === "moveTo") {
                const x = (actionCmd.pos.x - 0.5) * CELL_WIDTH;
                const y = (actionCmd.pos.y - 0.5) * CELL_HEIGHT;
                const moveTime = ANITIME.TOUCH_MOVE * 1000;

                if (tweenChain) {
                    tweenChain = tweenChain.to(moveTime, { position: new Vec3(x, y, 0) });
                } else {
                    tweenChain = tween(this.node).to(moveTime, { position: new Vec3(x, y, 0) });
                }
            }
            else if (actionCmd.action === "toDie") {
                if (this._model.status === CELL_STATUS.BIRD) {
                    const animation = this.node.getComponent(Animation);
                    animation.play("effect");
                    if (tweenChain) {
                        tweenChain = tweenChain.delay(ANITIME.BOMB_BIRD_DELAY * 1000);
                    } else {
                        tweenChain = tween(this.node).delay(ANITIME.BOMB_BIRD_DELAY * 1000);
                    }
                }

                if (tweenChain) {
                    tweenChain = tweenChain.call(() => {
                        this.node.destroy();
                    });
                } else {
                    tweenChain = tween(this.node).call(() => {
                        this.node.destroy();
                    });
                }
            }
            else if (actionCmd.action === "setVisible") {
                const isVisible = actionCmd.isVisible;
                if (tweenChain) {
                    tweenChain = tweenChain.call(() => {
                        const uiOpacity = this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity);
                        if (isVisible) {
                            uiOpacity.opacity = 255;
                        } else {
                            uiOpacity.opacity = 0;
                        }
                    });
                } else {
                    tweenChain = tween(this.node).call(() => {
                        const uiOpacity = this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity);
                        if (isVisible) {
                            uiOpacity.opacity = 255;
                        } else {
                            uiOpacity.opacity = 0;
                        }
                    });
                }
            }
            else if (actionCmd.action === "toShake") {
                const shakeActions = [
                    tween().to(0.06, { angle: 30 }),
                    tween().to(0.12, { angle: -60 }),
                    tween().to(0.06, { angle: 30 })
                ];

                if (tweenChain) {
                    tweenChain = tweenChain.sequence(...shakeActions).repeat(2);
                } else {
                    tweenChain = tween(this.node).sequence(...shakeActions).repeat(2);
                }
            }

            curTime = actionCmd.playTime + actionCmd.keepTime;
        }

        if (tweenChain) {
            tweenChain.start();
        }
    }

    setSelect(flag: boolean): void {
        const animation = this.node.getComponent(Animation);
        const bg = this.node.getChildByName("select");

        if (flag === false && this.isSelect && this._model.status === CELL_STATUS.COMMON) {
            animation.stop();
            const sprite = this.node.getComponent(Sprite);
            if (sprite) {
                sprite.spriteFrame = this.defaultFrame;
            }
        }
        else if (flag && this._model.status === CELL_STATUS.COMMON) {
            animation.play(CELL_STATUS.CLICK);
        }
        else if (flag && this._model.status === CELL_STATUS.BIRD) {
            animation.play(CELL_STATUS.CLICK);
        }

        if (bg) {
            bg.active = flag;
        }
        this.isSelect = flag;
    }
}