import { BannerConfig, EBannerEvents, EBannerType, IBanner } from "./interfaces";
import { Events } from "../events/Events";

type TBannerElement = HTMLIFrameElement | HTMLImageElement;

type BannerEvents = {
    [EBannerEvents.CLICK]: (banner: AdriverBanner) => void;
    [EBannerEvents.LOADED]: (banner: AdriverBanner) => void;
    [EBannerEvents.ERROR]: (banner: AdriverBanner) => void;
    [EBannerEvents.CREATED]: (banner: AdriverBanner) => void;
};

/**
 * Banner class, which represents banner on page
 */
export class AdriverBanner extends Events<BannerEvents> {
    public bannerElement: TBannerElement | null = null;
    public slot: Element | null = null;
    public source: string;
    public width: number;
    public height: number;

    public id: string | null = null;
    public type: EBannerType | null = null;
    public resource: string | null = null;

    // Resolving issue with removing banner, where it's not removed from DOM
    private removed = false;

    constructor(banner: IBanner) {
        super();
        if (isElement(banner.slot)) {
            this.slot = banner.slot;
        } else if (banner.slot) {
            this.slot = document.getElementById(banner.slot);
        }
        this.source = banner.source;
        this.width = banner.width;
        this.height = banner.height;

        this.onClick = this.onClick.bind(this);

        this.loadConfig().then(() => {
            this.createBanner();
        });
    }

    public sendError() {
        this.emit(EBannerEvents.ERROR, [this]);
    }

    public remove() {
        this.clear();
        this.removed = true;
        if (!this.slot || !this.bannerElement) {
            return;
        }
        this.slot.removeChild(this.bannerElement);
    }

    private async loadConfig() {
        return new Promise<void>((resolve) => {
            fetch(this.source)
                .then(async (response) => {
                    // TODO: type-check for object?
                    const data = (await response.json()) as BannerConfig;
                    this.id = data.id;
                    this.type = data.type;
                    this.resource = data.resource;
                    resolve();
                    this.emit(EBannerEvents.LOADED, [this]);
                })
                .catch(() => {
                    this.emit(EBannerEvents.ERROR, [this]);
                });
        });
    }

    private createBanner() {
        if (!this.slot || !this.resource || this.removed) {
            return;
        }
        let element: TBannerElement | null = null;
        switch (this.type) {
            case EBannerType.IMG:
                element = document.createElement("img");
                break;
            case EBannerType.IFRAME:
                element = document.createElement("iframe");
                break;
        }
        if (!element) {
            return;
        }
        element.src = this.resource;
        element.width = this.width;
        element.height = this.height;
        this.slot.appendChild(element);
        this.bannerElement = element;
        this.emit(EBannerEvents.CREATED, [this]);
    }

    private onClick() {
        this.emit(EBannerEvents.CLICK, [this]);
    }
}

function isElement(element: unknown): element is Element {
    return element instanceof Element;
}

