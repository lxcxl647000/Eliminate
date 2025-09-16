import adapter from "./adapter/adapter";
import platform_interface, { rewardedVideoAd } from "./platform_interface";
import platform_taobao from "./platform_taobao";
import platform_web from "./platform_web";

export default class platform implements platform_interface {
    private static TAG: string = "platform";
    private _platform: platform_interface = null;
    public get platform() {
        return this._platform;
    }

    public init() {
        if (adapter.inst.onTaobao()) {
            this._platform = new platform_taobao();
            console.log(platform.TAG + "::init->平台:淘宝小游戏");
        }
        else {
            this._platform = new platform_web();
            console.log(platform.TAG + "::init->平台:web");
        }
        if (this._platform) {
            this._platform.init();
        }
    }

    createRewardedAd(adUnitId: string) {

    }

    showRewardedAd(ad: rewardedVideoAd): void {
        this._platform.showRewardedAd(ad);
    }

}