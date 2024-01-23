import { ECustoms } from "../interfaces";
import { AdriverBanner } from "../Banner";
import { Events } from "../../events/Events";
import { BannerEventEvents, ECustomEvents, IBannerEvent, ICustomEvent } from "./interface";

export abstract class BannerEvent extends Events<BannerEventEvents> implements IBannerEvent {
    public abstract id: number;
    public abstract customs: ECustoms[];
    protected banner: AdriverBanner;

    protected constructor(banner: AdriverBanner) {
        super();
        this.banner = banner;
    }

    protected getCustomData(custom: ECustoms, banner: AdriverBanner) {
        switch (custom) {
            case ECustoms.WIDTH:
                return window.innerWidth;
            case ECustoms.HEIGHT:
                return window.innerHeight;
            case ECustoms.USER_AGENT:
                return navigator.userAgent;
            case ECustoms.URL:
                return window.location.href;
            case ECustoms.BANNER_WIDTH:
                return banner.width;
            case ECustoms.BANNER_HEIGHT:
                return banner.height;
            case ECustoms.BANNER_TYPE:
                return banner.type;
            case ECustoms.BANNER_ID:
                return banner.id;
            default:
                throw new Error("Unknown custom");
        }
    }

    protected sendEvent() {
        this.emit(ECustomEvents.EVENT, [
            {
                id: this.id,
                bannerId: this.banner.id,
                customs: this.customs.map((custom) => [custom, this.getCustomData(custom, this.banner)])
            } as ICustomEvent
        ]);
    }

    protected abstract destroy();
}
