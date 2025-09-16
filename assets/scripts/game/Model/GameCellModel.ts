import { CELL_TYPE, ANITIME, CELL_STATUS, GRID_HEIGHT } from "./ConstValue";
import { v2, Vec2 } from "cc";

export interface Command {
    action: string;
    keepTime?: number;
    playTime: number;
    pos?: Vec2;
    isVisible?: boolean;
    step?: number;
}

export default class GameCellModel {
    public type: CELL_TYPE | null;
    public status: CELL_STATUS;
    public x: number;
    public y: number;
    public startX: number;
    public startY: number;
    public cmd: Command[];
    public isDeath: boolean;
    public objecCount: number;

    constructor() {
        this.type = null;
        this.status = CELL_STATUS.COMMON;
        this.x = 1;
        this.y = 1;
        this.startX = 1;
        this.startY = 1;
        this.cmd = [];
        this.isDeath = false;
        this.objecCount = Math.floor(Math.random() * 1000);
    }

    init(type: CELL_TYPE): void {
        this.type = type;
    }

    isEmpty(): boolean {
        return this.type === CELL_TYPE.EMPTY;
    }

    setEmpty(): void {
        this.type = CELL_TYPE.EMPTY;
    }

    setXY(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    setStartXY(x: number, y: number): void {
        this.startX = x;
        this.startY = y;
    }

    setStatus(status: CELL_STATUS): void {
        this.status = status;
    }

    moveToAndBack(pos: Vec2): void {
        const srcPos = v2(this.x, this.y);
        this.cmd.push({
            action: "moveTo",
            keepTime: ANITIME.TOUCH_MOVE,
            playTime: 0,
            pos: pos
        });
        this.cmd.push({
            action: "moveTo",
            keepTime: ANITIME.TOUCH_MOVE,
            playTime: ANITIME.TOUCH_MOVE,
            pos: srcPos
        });
    }

    moveTo(pos: Vec2, playTime: number): void {
        const srcPos = v2(this.x, this.y);
        this.cmd.push({
            action: "moveTo",
            keepTime: ANITIME.TOUCH_MOVE,
            playTime: playTime,
            pos: pos
        });
        this.x = pos.x;
        this.y = pos.y;
    }

    toDie(playTime: number): void {
        this.cmd.push({
            action: "toDie",
            playTime: playTime,
            keepTime: ANITIME.DIE
        });
        this.isDeath = true;
    }

    toShake(playTime: number): void {
        this.cmd.push({
            action: "toShake",
            playTime: playTime,
            keepTime: ANITIME.DIE_SHAKE
        });
    }

    setVisible(playTime: number, isVisible: boolean): void {
        this.cmd.push({
            action: "setVisible",
            playTime: playTime,
            keepTime: 0,
            isVisible: isVisible
        });
    }

    moveToAndDie(pos: Vec2): void {
        // 实现留空，根据需求补充
    }

    isBird(): boolean {
        return this.type === CELL_TYPE.BIRD;
    }
}