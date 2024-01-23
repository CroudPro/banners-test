import { BannerEvent } from "../base";
import { EBannerEvents, ECustoms } from "../../interfaces";
import { AdriverBanner } from "../../Banner";

export class InitEvent extends BannerEvent {
    public customs: ECustoms[] = [
        ECustoms.WIDTH,
        ECustoms.HEIGHT,
        ECustoms.USER_AGENT,
        ECustoms.URL,
        ECustoms.BANNER_ID
    ];
    public id: number = 0;
    protected banner: AdriverBanner;

    constructor(banner: AdriverBanner) {
        super(banner);
        this.banner = banner;
        this.onInit = this.onInit.bind(this);
        banner.subscribe(EBannerEvents.LOADED, this.onInit);
    }

    protected destroy() {
        this.banner.unsubscribe(EBannerEvents.LOADED, this.onInit);
    }

    private onInit() {
        this.sendEvent();
    }
}