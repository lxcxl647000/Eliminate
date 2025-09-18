import { _decorator, Node, Vec2 } from "cc";
import GameModel from "../../game/Model/GameModel";
import GameCellModel, { Command } from "../../game/Model/GameCellModel";
import GameGridView from "./GameGridView";
import { PanelComponent, PanelHideOption, PanelShowOption } from "../../framework/lib/router/PanelComponent";

const { ccclass, property } = _decorator;

@ccclass
export default class GamePanel extends PanelComponent {
    show(option: PanelShowOption): void {
        option.onShowed();
    }
    hide(option: PanelHideOption): void {
        option.onHided();
    }
    @property(GameGridView)
    grid: GameGridView = null;

    private gameModel: GameModel = null;

    onLoad(): void {
        this.gameModel = new GameModel();
        this.gameModel.init(4);
    }

    protected onEnable(): void {
        this.grid.setController(this);
        this.grid.initWithCellModels(this.gameModel.getCells());
    }

    selectCell(pos: Vec2): [GameCellModel[], Command[]] {
        return this.gameModel.selectCell(pos);
    }

    cleanCmd(): void {
        this.gameModel.cleanCmd();
    }
}