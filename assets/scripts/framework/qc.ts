import EventManager from "./lib/eventmanager/EventManager";
import { EventManagerInterface } from "./lib/eventmanager/EventManagerInterface";
import PanelRouter from "./lib/router/PanelRouter";
import { LocalStorage } from "./lib/storage/LocalStorage";
import { LocalStorageInterface } from "./lib/storage/LocalStorageInterface";

/**
 * 框架接口
 */
export interface FrameworkInterface {
    /**
     * 事件广播、监听、注销管理器接口
     */
    eventManager: EventManagerInterface;

    /**
     * 面板路由器接口
     */
    panelRouter: PanelRouter;

    /**
     * 本地缓存键值对存储接口
     */
    storage: LocalStorageInterface;
}

/**
 * 框架入口
 */
export const qc: FrameworkInterface = {
    eventManager: new EventManager(),
    storage: new LocalStorage(),
    panelRouter: new PanelRouter()
};
