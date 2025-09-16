import { v2, Vec2 } from "cc";
import GameCellModel, { Command } from "./GameCellModel";
import { mergePointArray, exclusivePoint } from "../Utils/ModelUtils";
import { CELL_TYPE, CELL_BASENUM, CELL_STATUS, GRID_WIDTH, GRID_HEIGHT, ANITIME } from "./ConstValue";

export interface CheckPointResult {
    samePoints: Vec2[];
    newCellStatus: string;
    newCellType: number;
    crushPoint: Vec2;
}

export default class GameModel {
    private cells: GameCellModel[][];
    private cellBgs: any;
    private lastPos: Vec2;
    private cellTypeNum: number;
    private cellCreateType: number[];
    private changeModels: GameCellModel[];
    private effectsQueue: Command[];
    private curTime: number;

    constructor() {
        this.cells = null;
        this.cellBgs = null;
        this.lastPos = v2(-1, -1);
        this.cellTypeNum = 5;
        this.cellCreateType = []; // 生成种类只在这个数组里面查找
    }

    init(cellTypeNum: number): void {
        this.cells = [];
        this.setCellTypeNum(cellTypeNum || this.cellTypeNum);

        for (let i = 1; i <= GRID_WIDTH; i++) {
            this.cells[i] = [];
            for (let j = 1; j <= GRID_HEIGHT; j++) {
                this.cells[i][j] = new GameCellModel();
            }
        }

        // this.mock();

        for (let i = 1; i <= GRID_WIDTH; i++) {
            for (let j = 1; j <= GRID_HEIGHT; j++) {
                // 已经被mock数据生成了
                if (this.cells[i][j].type != null) {
                    continue;
                }

                let flag = true;
                while (flag) {
                    flag = false;
                    this.cells[i][j].init(this.getRandomCellType());

                    const result = this.checkPoint(j, i)[0];
                    if (result.length > 2) {
                        flag = true;
                    }

                    this.cells[i][j].setXY(j, i);
                    this.cells[i][j].setStartXY(j, i);
                }
            }
        }
    }

    mock(): void {
        this.mockInit(5, 1, CELL_TYPE.A);
        this.mockInit(5, 3, CELL_TYPE.A);
        this.mockInit(4, 2, CELL_TYPE.A);
        this.mockInit(3, 2, CELL_TYPE.A);
        this.mockInit(5, 2, CELL_TYPE.B);
        this.mockInit(6, 2, CELL_TYPE.B);
        this.mockInit(7, 3, CELL_TYPE.B);
        this.mockInit(8, 2, CELL_TYPE.A);
    }

    mockInit(x: number, y: number, type: number): void {
        this.cells[x][y].init(type);
        this.cells[x][y].setXY(y, x);
        this.cells[x][y].setStartXY(y, x);
    }

    initWithData(data: any): void {
        // to do
    }

    /**
     * 检查点
     * @param x 
     * @param y 
     * @param recursive 是否递归查找
     * @returns {([]|string|*)[]}
     */
    checkPoint(x: number, y: number, recursive: boolean = false): [Vec2[], CELL_STATUS, number, Vec2] {
        const rowResult = this.checkWithDirection(x, y, [v2(1, 0), v2(-1, 0)]);
        const colResult = this.checkWithDirection(x, y, [v2(0, -1), v2(0, 1)]);
        let samePoints: Vec2[] = [];
        let newCellStatus = CELL_STATUS.COMMON;

        if (rowResult.length >= 5 || colResult.length >= 5) {
            newCellStatus = CELL_STATUS.BIRD;
        } else if (rowResult.length >= 3 && colResult.length >= 3) {
            newCellStatus = CELL_STATUS.WRAP;
        } else if (rowResult.length >= 4) {
            newCellStatus = CELL_STATUS.LINE;
        } else if (colResult.length >= 4) {
            newCellStatus = CELL_STATUS.COLUMN;
        }

        if (rowResult.length >= 3) {
            samePoints = rowResult;
        }
        if (colResult.length >= 3) {
            samePoints = mergePointArray(samePoints, colResult);
        }

        let result: [Vec2[], CELL_STATUS, number, Vec2] = [
            samePoints,
            newCellStatus,
            this.cells[y][x].type,
            v2(x, y)
        ];

        // 检查一下消除的其他节点，能不能生成更大范围的消除
        if (recursive && samePoints.length >= 3) {
            const subCheckPoints = exclusivePoint(samePoints, v2(x, y));
            for (const point of subCheckPoints) {
                const subResult = this.checkPoint(point.x, point.y, false);
                if (subResult[1] > result[1] || (subResult[1] === result[1] && subResult[0].length > result[0].length)) {
                    result = subResult;
                }
            }
        }

        return result;
    }

    checkWithDirection(x: number, y: number, direction: Vec2[]): Vec2[] {
        const queue: Vec2[] = [];
        const vis: boolean[] = [];
        vis[x + y * 9] = true;
        queue.push(v2(x, y));
        let front = 0;

        while (front < queue.length) {
            const point = queue[front];
            const cellModel = this.cells[point.y][point.x];
            front++;

            if (!cellModel) {
                continue;
            }

            for (let i = 0; i < direction.length; i++) {
                const tmpX = point.x + direction[i].x;
                const tmpY = point.y + direction[i].y;

                if (tmpX < 1 || tmpX > 9 || tmpY < 1 || tmpY > 9 ||
                    vis[tmpX + tmpY * 9] || !this.cells[tmpY][tmpX]) {
                    continue;
                }

                if (cellModel.type === this.cells[tmpY][tmpX].type) {
                    vis[tmpX + tmpY * 9] = true;
                    queue.push(v2(tmpX, tmpY));
                }
            }
        }

        return queue;
    }

    printInfo(): void {
        for (let i = 1; i <= 9; i++) {
            let printStr = "";
            for (let j = 1; j <= 9; j++) {
                printStr += this.cells[i][j].type + " ";
            }
            console.log(printStr);
        }
    }

    getCells(): GameCellModel[][] {
        return this.cells;
    }

    // controller调用的主要入口
    // 点击某个格子
    selectCell(pos: Vec2): [GameCellModel[], Command[]] {
        this.changeModels = []; // 发生改变的model，将作为返回值，给view播动作
        this.effectsQueue = []; // 动物消失，爆炸等特效

        const lastPos = this.lastPos;
        const delta = Math.abs(pos.x - lastPos.x) + Math.abs(pos.y - lastPos.y);

        if (delta !== 1) { // 非相邻格子，直接返回
            this.lastPos = pos;
            return [[], []];
        }

        const curClickCell = this.cells[pos.y][pos.x]; // 当前点击的格子
        const lastClickCell = this.cells[lastPos.y][lastPos.x]; // 上一次点击的格子

        this.exchangeCell(lastPos, pos);
        const result1 = this.checkPoint(pos.x, pos.y)[0];
        const result2 = this.checkPoint(lastPos.x, lastPos.y)[0];

        this.curTime = 0; // 动画播放的当前时间
        this.pushToChangeModels(curClickCell);
        this.pushToChangeModels(lastClickCell);

        const isCanBomb = (curClickCell.status !== CELL_STATUS.COMMON &&
            lastClickCell.status !== CELL_STATUS.COMMON) ||
            curClickCell.status === CELL_STATUS.BIRD ||
            lastClickCell.status === CELL_STATUS.BIRD;

        if (result1.length < 3 && result2.length < 3 && !isCanBomb) { // 不会发生消除的情况
            this.exchangeCell(lastPos, pos);
            curClickCell.moveToAndBack(lastPos);
            lastClickCell.moveToAndBack(pos);
            this.lastPos = v2(-1, -1);
            return [this.changeModels, []];
        } else {
            this.lastPos = v2(-1, -1);
            curClickCell.moveTo(lastPos, this.curTime);
            lastClickCell.moveTo(pos, this.curTime);
            const checkPoint = [pos, lastPos];
            this.curTime += ANITIME.TOUCH_MOVE;
            this.processCrush(checkPoint);
            return [this.changeModels, this.effectsQueue];
        }
    }

    // 消除
    processCrush(checkPoint: Vec2[]): void {
        let cycleCount = 0;

        while (checkPoint.length > 0) {
            let bombModels: GameCellModel[] = [];

            if (cycleCount === 0 && checkPoint.length === 2) { // 特殊消除
                const pos1 = checkPoint[0];
                const pos2 = checkPoint[1];
                const model1 = this.cells[pos1.y][pos1.x];
                const model2 = this.cells[pos2.y][pos2.x];

                if (model1.status === CELL_STATUS.BIRD || model2.status === CELL_STATUS.BIRD) {
                    if (model1.status === CELL_STATUS.BIRD) {
                        model1.type = model2.type;
                        bombModels.push(model1);
                    } else {
                        model2.type = model1.type;
                        bombModels.push(model2);
                    }
                }
            }

            for (const pos of checkPoint) {
                if (!this.cells[pos.y][pos.x]) {
                    continue;
                }

                const [result, newCellStatus, newCellType, crushPoint] = this.checkPoint(pos.x, pos.y, true);

                if (result.length < 3) {
                    continue;
                }

                for (const point of result) {
                    const model = this.cells[point.y][point.x];
                    this.crushCell(point.x, point.y, false, cycleCount);

                    if (model.status !== CELL_STATUS.COMMON) {
                        bombModels.push(model);
                    }
                }

                this.createNewCell(crushPoint, newCellStatus, newCellType);
            }

            this.processBomb(bombModels, cycleCount);
            this.curTime += ANITIME.DIE;
            checkPoint = this.down();
            cycleCount++;
        }
    }

    // 生成新cell
    createNewCell(pos: Vec2, status: CELL_STATUS, type: number): void {
        if (status === CELL_STATUS.COMMON) {
            return;
        }

        if (status === CELL_STATUS.BIRD) {
            type = CELL_TYPE.BIRD;
        }

        const model = new GameCellModel();
        this.cells[pos.y][pos.x] = model;
        model.init(type);
        model.setStartXY(pos.x, pos.y);
        model.setXY(pos.x, pos.y);
        model.setStatus(status);
        model.setVisible(0, false);
        model.setVisible(this.curTime, true);
        this.changeModels.push(model);
    }

    // 下落
    down(): Vec2[] {
        const newCheckPoint: Vec2[] = [];

        for (let j = 1; j <= GRID_WIDTH; j++) {
            for (let i = 1; i <= GRID_HEIGHT; i++) {
                if (this.cells[i][j] === null) {
                    let curRow = i;

                    for (let k = curRow; k <= GRID_HEIGHT; k++) {
                        if (this.cells[k][j]) {
                            this.pushToChangeModels(this.cells[k][j]);
                            newCheckPoint.push(v2(j, curRow));
                            this.cells[curRow][j] = this.cells[k][j];
                            this.cells[k][j] = null;
                            this.cells[curRow][j].setXY(j, curRow);
                            this.cells[curRow][j].moveTo(v2(j, curRow), this.curTime);
                            curRow++;
                        }
                    }

                    let count = 1;
                    for (let k = curRow; k <= GRID_HEIGHT; k++) {
                        this.cells[k][j] = new GameCellModel();
                        this.cells[k][j].init(this.getRandomCellType());
                        this.cells[k][j].setStartXY(j, count + GRID_HEIGHT);
                        this.cells[k][j].setXY(j, count + GRID_HEIGHT);
                        this.cells[k][j].moveTo(v2(j, k), this.curTime);
                        count++;
                        this.changeModels.push(this.cells[k][j]);
                        newCheckPoint.push(v2(j, k));
                    }
                }
            }
        }

        this.curTime += ANITIME.TOUCH_MOVE + 0.3;
        return newCheckPoint;
    }

    pushToChangeModels(model: GameCellModel): void {
        if (this.changeModels.indexOf(model) !== -1) {
            return;
        }
        this.changeModels.push(model);
    }

    cleanCmd(): void {
        for (let i = 1; i <= GRID_WIDTH; i++) {
            for (let j = 1; j <= GRID_HEIGHT; j++) {
                if (this.cells[i][j]) {
                    this.cells[i][j].cmd = [];
                }
            }
        }
    }

    exchangeCell(pos1: Vec2, pos2: Vec2): void {
        const tmpModel = this.cells[pos1.y][pos1.x];
        this.cells[pos1.y][pos1.x] = this.cells[pos2.y][pos2.x];
        this.cells[pos1.y][pos1.x].x = pos1.x;
        this.cells[pos1.y][pos1.x].y = pos1.y;
        this.cells[pos2.y][pos2.x] = tmpModel;
        this.cells[pos2.y][pos2.x].x = pos2.x;
        this.cells[pos2.y][pos2.x].y = pos2.y;
    }

    // 设置种类
    // Todo 改成乱序算法
    setCellTypeNum(num: number): void {
        console.log("num = ", num);
        this.cellTypeNum = num;
        this.cellCreateType = [];
        const createTypeList = this.cellCreateType;

        for (let i = 1; i <= CELL_BASENUM; i++) {
            createTypeList.push(i);
        }

        for (let i = 0; i < createTypeList.length; i++) {
            const index = Math.floor(Math.random() * (CELL_BASENUM - i)) + i;
            [createTypeList[i], createTypeList[index]] = [createTypeList[index], createTypeList[i]];
        }
    }

    // 随机生成一个类型
    getRandomCellType(): number {
        const index = Math.floor(Math.random() * this.cellTypeNum);
        return this.cellCreateType[index];
    }

    // TODO bombModels去重
    processBomb(bombModels: GameCellModel[], cycleCount: number): void {
        while (bombModels.length > 0) {
            const newBombModel: GameCellModel[] = [];
            let bombTime = ANITIME.BOMB_DELAY;

            bombModels.forEach((model) => {
                if (model.status === CELL_STATUS.LINE) {
                    for (let i = 1; i <= GRID_WIDTH; i++) {
                        if (this.cells[model.y][i]) {
                            if (this.cells[model.y][i].status !== CELL_STATUS.COMMON) {
                                newBombModel.push(this.cells[model.y][i]);
                            }
                            this.crushCell(i, model.y, false, cycleCount);
                        }
                    }
                    this.addRowBomb(this.curTime, v2(model.x, model.y));
                } else if (model.status === CELL_STATUS.COLUMN) {
                    for (let i = 1; i <= GRID_HEIGHT; i++) {
                        if (this.cells[i][model.x]) {
                            if (this.cells[i][model.x].status !== CELL_STATUS.COMMON) {
                                newBombModel.push(this.cells[i][model.x]);
                            }
                            this.crushCell(model.x, i, false, cycleCount);
                        }
                    }
                    this.addColBomb(this.curTime, v2(model.x, model.y));
                } else if (model.status === CELL_STATUS.WRAP) {
                    const x = model.x;
                    const y = model.y;

                    for (let i = 1; i <= GRID_HEIGHT; i++) {
                        for (let j = 1; j <= GRID_WIDTH; j++) {
                            const delta = Math.abs(x - j) + Math.abs(y - i);
                            if (this.cells[i][j] && delta <= 2) {
                                if (this.cells[i][j].status !== CELL_STATUS.COMMON) {
                                    newBombModel.push(this.cells[i][j]);
                                }
                                this.crushCell(j, i, false, cycleCount);
                            }
                        }
                    }
                } else if (model.status === CELL_STATUS.BIRD) {
                    let crushType = model.type;
                    if (bombTime < ANITIME.BOMB_BIRD_DELAY) {
                        bombTime = ANITIME.BOMB_BIRD_DELAY;
                    }

                    if (crushType === CELL_TYPE.BIRD) {
                        crushType = this.getRandomCellType();
                    }

                    for (let i = 1; i <= GRID_HEIGHT; i++) {
                        for (let j = 1; j <= GRID_WIDTH; j++) {
                            if (this.cells[i][j] && this.cells[i][j].type === crushType) {
                                if (this.cells[i][j].status !== CELL_STATUS.COMMON) {
                                    newBombModel.push(this.cells[i][j]);
                                }
                                this.crushCell(j, i, true, cycleCount);
                            }
                        }
                    }
                }
            });

            if (bombModels.length > 0) {
                this.curTime += bombTime;
            }

            bombModels = newBombModel;
        }
    }

    /**
     * 
     * @param playTime 开始播放的时间
     * @param pos cell位置
     * @param step 第几次消除，用于播放音效
     */
    addCrushEffect(playTime: number, pos: Vec2, step: number): void {
        this.effectsQueue.push({
            playTime,
            pos,
            action: "crush",
            step
        });
    }

    addRowBomb(playTime: number, pos: Vec2): void {
        this.effectsQueue.push({
            playTime,
            pos,
            action: "rowBomb",
        });
    }

    addColBomb(playTime: number, pos: Vec2): void {
        this.effectsQueue.push({
            playTime,
            pos,
            action: "colBomb"
        });
    }

    addWrapBomb(playTime: number, pos: Vec2): void {
        // TODO
    }

    // cell消除逻辑
    crushCell(x: number, y: number, needShake: boolean, step: number): void {
        const model = this.cells[y][x];
        this.pushToChangeModels(model);

        if (needShake) {
            model.toShake(this.curTime);
        }

        const shakeTime = needShake ? ANITIME.DIE_SHAKE : 0;
        model.toDie(this.curTime + shakeTime);
        this.addCrushEffect(this.curTime + shakeTime, v2(model.x, model.y), step);
        this.cells[y][x] = null;
    }
}