export default interface platform_interface {
    init(): void

    // 激励广告//
    createRewardedAd(adUnitId: string): any
    showRewardedAd(ad: rewardedVideoAd): void
}

export interface rewardedVideoAd {
    adUnitId: string,
    showCb?: Function,
    successCb?: Function,
    failCb?: Function,
    errorCb?: Function
}