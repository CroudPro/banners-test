import { AdriverBanner } from "../Banner";
import { ECustoms } from "../interfaces";
import { Events } from "../../events/Events";

export type TBannerEvent = new (banner: AdriverBanner) => IBannerEvent;

export type BannerEventEvents = {
    [ECustomEvents.EVENT]: (event: ICustomEvent) => void;
};

export interface IBannerEvent extends Events<BannerEventEvents> {
    id: number;
    customs: ECustoms[];

    destroy(): void;
}

export interface ICustomEvent {
    id: number;
    bannerId: string;
    customs: [ECustoms, unknown][];
}

export enum ECustomEvents {
    EVENT = "event"
}