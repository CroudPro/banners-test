import { AdriverBannersConfig, IBanner } from "./interfaces";
import { AdriverBanner } from "./Banner";

import { ECustomEvents, IBannerEvent, ICustomEvent, TBannerEvent } from "./events/interface";
import { Events } from "../events/Events";
import { InitEvent } from "./events/custom/InitEvent";
import { ClickEvent } from "./events/custom/ClickEvent";
import { ErrorEvent } from "./events/custom/ErrorEvent";
import { FirstVisible } from "./events/custom/FirstVisible";
import { ConsecutiveVisible } from "./events/custom/ConsecutiveVisible";


type AdriverBannersEvents = {
    [key: number]: (bannerId: string) => void;
}

type IBanner = [AdriverBanner, IBannerEvent[]];

/**
 * Creator of banners and server requests
 */
export class AdriverBanners extends Events<AdriverBannersEvents> {
    public listeners: TBannerEvent[] = [InitEvent, ClickEvent, ErrorEvent, FirstVisible, ConsecutiveVisible];
    private banners: IBanner[];
    private mainUrl: string;
    private random = false;

    constructor(config: AdriverBannersConfig) {
        super();
        this.onListenerEvent = this.onListenerEvent.bind(this);

        const banners = config.banners.map((banner: IBanner) => new AdriverBanner(banner));
        this.banners = banners.map((banner) => [banner, this.addListenersToBanner(banner)] as IBanner);


        this.mainUrl = config.mainUrl;
        if (this.mainUrl.indexOf("?") >= 1) {
            this.random = true;
            this.mainUrl = this.mainUrl.substring(0, this.mainUrl.indexOf("?"));
        }
    }

    public remove() {
        this.banners.forEach((banner) => {
            banner[1].forEach((listener) => {
                listener.destroy();
            });
            banner[0].destroy();
        });
        this.banners = [];
    }

    private addListenersToBanner(banner: AdriverBanner) {
        return this.listeners.map((Listener) => {
            const listener = new Listener(banner);
            listener.subscribe(ECustomEvents.EVENT, this.onListenerEvent);
            return listener;
        });
    }

    private onListenerEvent(event: ICustomEvent) {
        console.log(event);
        this.sendBeacon(event);
    }

    private sendBeacon(event: ICustomEvent, retry = false) {
        const params = this.getUrlParams(event);
        fetch(this.mainUrl + "?" + params.toString(), {
            method: "GET"
        }).catch(() => {
            if (retry) {
                const founded = this.banners.find((banner) => banner[0].id === event.bannerId);
                if (founded) {
                    founded[0].sendError();
                }
            } else {
                // TODO: maybe add check for 2nd error response, not in specifications
                // May be network error
                this.sendBeacon(event, true);
            }
        }).then(() => {
            this.emit(event.id, [event.bannerId]);
        });
    }

    private getUrlParams(event: ICustomEvent) {
        const params = new URLSearchParams({
            type: event.id.toString(),
            customs: event.customs.map((custom) => custom.join("=")).join(";")
        });
        if (this.random) {
            params.append("random", generateRandom().toString());
        }
        return params;
    }


}

/**
 * Generate random number from 100000 to 999999
 */
function generateRandom() {
    return Math.floor(Math.random() * 899999) + 100000;
}


