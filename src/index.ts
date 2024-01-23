import { AdriverBanners } from "./banners/AdriverBanners";
import { AdriverBannersConfig } from "./banners/interfaces";

const testConfig: AdriverBannersConfig = {
    mainUrl: "http://localhost:3000/main?rnd",

    banners: [
        {
            slot: "b1",
            source: "http://localhost:3000/b1_img",
            width: 322,
            height: 260
        },

        {
            slot: "b2",
            source: "http://localhost:3000/b2_img",
            width: 181,
            height: 260
        },

        {
            slot: document.querySelector("#b3"),
            source: "http://localhost:3000/b3_img",
            width: 577,
            height: 262
        },

        {
            slot: "b4",
            source: "http://localhost:3000/b1_html",
            width: 350,
            height: 350
        },

        {
            slot: "b5",
            source: "http://localhost:3000/b2_html",
            width: 200,
            height: 100
        },

        {
            slot: document.querySelector("#b6"),
            source: "http://localhost:3000/b3_html",
            width: 400,
            height: 250
        }
    ]
};
const banners = new AdriverBanners(testConfig);
// test
const listener = (event: string) => {
    console.log(event);
};

banners.subscribe(0, listener);

// setTimeout(() => {
//     console.log("unsubscribe");
//     banners.unsubscribe(0, listener);
//
// },1000)


// banners.remove();


