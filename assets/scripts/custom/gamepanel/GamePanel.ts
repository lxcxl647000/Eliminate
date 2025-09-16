import { _decorator, Component, Node, Vec2 } from "cc";
import GameModel from "../../game/Model/GameModel";
import GameCellModel, { Command } from "../../game/Model/GameCellModel";
import GameGridView from "./GameGridView";

const { ccclass, property } = _decorator;

@ccclass
export default class GamePanel extends Component {
    @property(Node)
    grid: Node = null;

    @property(Node)
    audioButton: Node = null;
    private gameModel: GameModel = null;

    onLoad(): void {
        this.gameModel = new GameModel();
        this.gameModel.init(4);

        const gridScript = this.grid.getComponent(GameGridView);
        gridScript.setController(this);
        gridScript.initWithCellModels(this.gameModel.getCells());
    }

    selectCell(pos: Vec2): [GameCellModel[], Command[]] {
        return this.gameModel.selectCell(pos);
    }

    cleanCmd(): void {
        this.gameModel.cleanCmd();
    }
}