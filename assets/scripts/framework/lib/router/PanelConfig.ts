/**
 * 面板配置
 *
 */
export interface PanelConfig {
    /**
     * 面板的 Prefab 路径，需要写上对应的 bundleName
     *
     * e.g.
     *
     * resources/prefabs/SettingPanelPrefab
     */
    prefabPath: string;

    /**
     * 面板所在的层级节点的ZIndex
     */
    layerZIndex: number;
}
