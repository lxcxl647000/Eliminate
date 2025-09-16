import { _decorator, Component, Node, Prefab, Animation, instantiate } from 'cc';
import { CELL_WIDTH } from '../../game/Model/ConstValue';
import { Command } from '../../game/Model/GameCellModel';

const { ccclass, property } = _decorator;

@ccclass('GameEffectLayer')
export class GameEffectLayer extends Component {
    @property({ type: Prefab })
    bombWhite: Prefab | null = null;

    @property({ type: Prefab })
    crushEffect: Prefab | null = null;

    onLoad() {
        // 初始化代码可以在这里添加
    }

    playEffects(effectQueue: Command[]) {
        if (!effectQueue || effectQueue.length <= 0) {
            return;
        }

        const soundMap: Record<string, boolean> = {}; // 某一时刻，某一种声音是否播放过的标记，防止重复播放

        effectQueue.forEach((cmd) => {
            this.scheduleOnce(() => {
                let instantEffect: Node | null = null;
                let animation: Animation | null = null;

                if (cmd.action == "crush") {
                    if (this.crushEffect) {
                        instantEffect = instantiate(this.crushEffect);
                        animation = instantEffect.getComponent(Animation);
                        if (animation) {
                            animation.play("effect");
                        }

                        soundMap["crush" + cmd.playTime] = true;
                    }
                } else if (cmd.action == "rowBomb") {
                    if (this.bombWhite) {
                        instantEffect = instantiate(this.bombWhite);
                        animation = instantEffect.getComponent(Animation);
                        if (animation) {
                            animation.play("effect_line");
                        }
                    }
                } else if (cmd.action == "colBomb") {
                    if (this.bombWhite) {
                        instantEffect = instantiate(this.bombWhite);
                        animation = instantEffect.getComponent(Animation);
                        if (animation) {
                            animation.play("effect_col");
                        }
                    }
                }

                if (instantEffect && this.node) {
                    instantEffect.setPosition(
                        CELL_WIDTH * (cmd.pos.x - 0.5),
                        CELL_WIDTH * (cmd.pos.y - 0.5),
                        0
                    );
                    this.node.addChild(instantEffect);

                    if (animation) {
                        animation.on(Animation.EventType.FINISHED, () => {
                            if (instantEffect) {
                                instantEffect.destroy();
                            }
                        });
                    }
                }
            }, cmd.playTime);
        });
    }
}