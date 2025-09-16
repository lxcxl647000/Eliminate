import { baseConfig } from "../../../configs/baseConfig";
import platform_interface, { rewardedVideoAd } from "./platform_interface";
const my = globalThis['my'];

export class RewardedVideoAd {
    private _tag = '';
    private _isLoaded = false;
    /**
     * 广告实列
     */
    private _rewardedVideoAd: any = null;
    private _adUnitId: string = null;

    private _showCb: Function = null;
    public set showCb(cb: Function) {
        this._showCb = cb;
    }

    private _closeCb: Function = null;
    public set closeCb(cb: Function) {
        this._closeCb = cb;
    }

    private _errorCb: Function = null;
    public set errorCb(cb: Function) {
        this._errorCb = cb;
    }

    constructor(adUnitId: string) {
        this._tag = platform_taobao.tag + this._adUnitId;
        this._adUnitId = adUnitId;
        this._rewardedVideoAd = my.createRewardedAd({ adUnitId });
        this._rewardedVideoAd.onLoad((res) => {
            this._isLoaded = true;
            console.log(this._tag, '广告加载成功');

        });
        this._rewardedVideoAd.onClose((res) => {
            console.log(this._tag, '广告关闭', res);
            this._closeCb && this._closeCb(res);
            this._closeCb = null;
        });
        this._rewardedVideoAd.onError((res) => {
            console.log(this._tag, '广告组件出现问题', res);
            this._errorCb && this._errorCb(res);
            this._errorCb = null;
        });
    }

    public showAD() {
        if (this._isLoaded) {
            this._rewardedVideoAd
                .show()
                .then((res) => {
                    console.log(this._tag, '广告显示成功', res);
                    this._showCb && this._showCb(res);
                    this._showCb = null;
                })
                .catch((err) => {
                    console.log(this._tag, '广告组件出现问题', err);
                    // 再次重试加载一次          
                    this._rewardedVideoAd
                        .load()
                        .then(() => {
                            console.log(this._tag, '手动加载成功', err);
                            this.showAD();
                        });
                })
        } else {
            console.log(`taobao ${this._adUnitId}广告没加载完成`);
        }
    }
}

export default class platform_taobao implements platform_interface {
    public static tag = 'taobao platform';
    private _rewardedVideoAdMap: Map<string, RewardedVideoAd> = new Map();
    showRewardedAd(ad: rewardedVideoAd): void {
        let rewardedVideoAd = this._rewardedVideoAdMap.get(ad.adUnitId);
        if (rewardedVideoAd) {
            rewardedVideoAd.showCb = ad.successCb;
            rewardedVideoAd.closeCb = ad.failCb;
            rewardedVideoAd.errorCb = ad.errorCb;
            rewardedVideoAd.showAD();
        }
        else {
            console.log(`${platform_taobao.tag + ad.adUnitId}广告未加载成功`);
        }
    }
    init(): void {
        for (let adUnitId of baseConfig.adUnitIds) {
            this.createRewardedAd(adUnitId);
        }
    }

    createRewardedAd(adUnitId: string) {
        let rewardedVideoAd = new RewardedVideoAd(adUnitId);
        this._rewardedVideoAdMap.set(adUnitId, rewardedVideoAd);
    }

}