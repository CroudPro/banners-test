import { BannerEvent } from "../base";
import { EBannerEvents, EBannerType, ECustoms } from "../../interfaces";
import { AdriverBanner } from "../../Banner";

export class ClickEvent extends BannerEvent {
    public customs: ECustoms[] = [ECustoms.BANNER_WIDTH, ECustoms.BANNER_HEIGHT, ECustoms.BANNER_TYPE, ECustoms.BANNER_ID];
    public id: number = 3;
    protected banner: AdriverBanner;

    constructor(banner: AdriverBanner) {
        super(banner);
        this.banner = banner;
        this.onInit = this.onInit.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onBlur = this.onBlur.bind(this);

        banner.subscribe(EBannerEvents.LOADED, this.onInit);
    }

    private onInit() {
        if (this.banner.slot && this.banner.type !== EBannerType.IFRAME) {
            this.banner.slot.addEventListener("click", this.onClick);
        } else {
            // special iframe case
            window.addEventListener("blur", this.onBlur);
        }
    }

    private onBlur() {
        setTimeout(() => {
            if (this.banner.bannerElement && document.activeElement == this.banner.bannerElement) {
                this.onClick();
                // detect on second attempt
                window.focus();
            }
        }, 0);
    }

    private destroy() {
        if (this.banner.slot && this.banner.type !== EBannerType.IFRAME) {
            this.banner.slot.removeEventListener("click", this.onClick);
        }
        window.removeEventListener("blur", this.onBlur);
        this.banner.unsubscribe(EBannerEvents.LOADED, this.onInit);
    }

    private onClick() {
        this.sendEvent();
    }
}