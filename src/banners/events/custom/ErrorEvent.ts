import { BannerEvent } from "../base";
import { EBannerEvents, ECustoms } from "../../interfaces";
import { AdriverBanner } from "../../Banner";

export class ErrorEvent extends BannerEvent {
    public customs: ECustoms[] = [
        ECustoms.WIDTH,
        ECustoms.HEIGHT,
        ECustoms.USER_AGENT,
        ECustoms.URL,
        ECustoms.BANNER_WIDTH,
        ECustoms.BANNER_HEIGHT,
        ECustoms.BANNER_TYPE,
        ECustoms.BANNER_ID
    ];
    public id: number = 4;
    protected banner: AdriverBanner;

    constructor(banner: AdriverBanner) {
        super(banner);
        this.banner = banner;
        this.onError = this.onError.bind(this);
        banner.subscribe(EBannerEvents.ERROR, this.onError);
    }

    protected destroy() {
        this.banner.unsubscribe(EBannerEvents.ERROR, this.onError);
    }

    private onError() {
        this.sendEvent();
    }
}
