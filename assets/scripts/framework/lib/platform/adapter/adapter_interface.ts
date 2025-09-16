/**
 * 引擎适配文件
 */
export default interface adapter_interface {
    /**是否在taobao运行环境 */
    onTaobao(): boolean;
}