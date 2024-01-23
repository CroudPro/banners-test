export type TBannerElement = string | Element | null;

export interface IBanner {
    slot: TBannerElement;
    source: string;
    width: number;
    height: number;
}

export interface BannerConfig {
    id: string;
    type: EBannerType;
    resource: string;
}

export interface AdriverBannersConfig {
    mainUrl: string;
    banners: IBanner[];
}

export enum EBannerEvents {
    CLICK = "click",
    LOADED = "loaded",
    ERROR = "error",
    CREATED = "created"
}

export enum ECustoms {
    WIDTH = 100,
    HEIGHT,
    USER_AGENT,
    URL,
    BANNER_WIDTH,
    BANNER_HEIGHT,
    BANNER_TYPE,
    BANNER_ID
}

export enum EBannerType {
    IMG = "img",
    IFRAME = "iframe"
}