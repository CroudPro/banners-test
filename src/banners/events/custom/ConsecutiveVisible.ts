import { BannerEvent } from "../base";
import { EBannerEvents, ECustoms } from "../../interfaces";
import { AdriverBanner } from "../../Banner";
import { intersectionConfig } from "../shared";

export class ConsecutiveVisible extends BannerEvent {
    public customs: ECustoms[] = [
        ECustoms.BANNER_WIDTH,
        ECustoms.BANNER_HEIGHT,
        ECustoms.BANNER_TYPE,
        ECustoms.BANNER_ID
    ];
    public id: number = 2;
    protected banner: AdriverBanner;

    private observer: IntersectionObserver | null = null;
    private timer: NodeJS.Timeout | null = null;

    constructor(banner: AdriverBanner) {
        super(banner);
        this.banner = banner;
        this.onInit = this.onInit.bind(this);

        banner.subscribe(EBannerEvents.CREATED, this.onInit);
    }

    protected destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.banner.unsubscribe(EBannerEvents.CREATED, this.onInit);
    }

    private onInit() {
        if (!this.banner.bannerElement) {
            return;
        }
        this.observer = new IntersectionObserver((entries) => {
            if (!entries) {
                return;
            }
            const entry = entries[0];
            if (entry.isIntersecting) {
                this.timer = setTimeout(() => {
                    this.observer?.unobserve(entry.target);
                    this.sendEvent();
                }, 1000);
            } else if (this.timer) {
                clearTimeout(this.timer);
            }
        }, intersectionConfig);
        this.observer.observe(this.banner.bannerElement);
    }
}