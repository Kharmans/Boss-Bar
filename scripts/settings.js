import { BarStyleConfiguration } from "./app/BarStyleConfiguration.js";
import { BossBar } from "./app/BossBar.js";
import { BAR_STYLES, MODULE_ID } from "./main.js";

const SETTING_CACHE = {};
const DEFAULT_CACHE = false;

export const DEFAULT_BAR_STYLE = {
    name: "Classic - Red",
    id: "default",
    background: "modules/bossbar/resources/Dark.webp",
    bar: "modules/bossbar/resources/Blood.webp",
    foreground: "",
    tempBarColor: "#7e7e7e",
    tempBarAlpha: 0.5,
    barHeight: 20,
    textSize: 20,
    textAlign: "left",
    type: 0,
    font: "Times New Roman",
};

const PREDEFINED_BAR_STYLES = [
    {
        ...DEFAULT_BAR_STYLE,
        name: "Classic - Ice",
        id: "default-ice",
        bar: "modules/bossbar/resources/Ice.webp",
    },
    {
        ...DEFAULT_BAR_STYLE,
        name: "Classic - Grass",
        id: "default-grass",
        bar: "modules/bossbar/resources/Grass.webp",
    },
    {
        ...DEFAULT_BAR_STYLE,
        name: "Classic - Oak",
        id: "default-oak",
        bar: "modules/bossbar/resources/Oak.webp",
    },
    {
        ...DEFAULT_BAR_STYLE,
        name: "Evil",
        id: "evil",
        foreground: "modules/bossbar/resources/matching-images/evil/fg.png",
        bar: "modules/bossbar/resources/matching-images/evil/bar.png",
        background: "modules/bossbar/resources/matching-images/evil/bg.png",
        type: 1,
    },
    {
        ...DEFAULT_BAR_STYLE,
        name: "Gears",
        id: "gears",
        foreground: "modules/bossbar/resources/matching-images/gears/fg.webp",
        bar: "modules/bossbar/resources/matching-images/gears/bar.webp",
        background: "modules/bossbar/resources/matching-images/gears/bg.webp",
        type: 1,
    },
    {
        ...DEFAULT_BAR_STYLE,
        name: "Ooze",
        id: "ooze",
        foreground: "modules/bossbar/resources/matching-images/ooze/fg.webp",
        bar: "modules/bossbar/resources/matching-images/ooze/bar.webp",
        background: "modules/bossbar/resources/matching-images/ooze/bg.webp",
        type: 1,
    },
    {
        ...DEFAULT_BAR_STYLE,
        name: "Royal",
        id: "royal",
        foreground: "modules/bossbar/resources/matching-images/royal/fg.png",
        bar: "modules/bossbar/resources/matching-images/royal/bar.png",
        background: "modules/bossbar/resources/matching-images/royal/bg.png",
        type: 1,
    },
    {
        ...DEFAULT_BAR_STYLE,
        name: "Segmented",
        id: "segmented",
        foreground: "modules/bossbar/resources/matching-images/segmented/fg.png",
        bar: "modules/bossbar/resources/matching-images/segmented/bar.png",
        background: "modules/bossbar/resources/matching-images/segmented/bg.png",
        type: 1,
    },
    {
        ...DEFAULT_BAR_STYLE,
        name: "Steampunk",
        id: "steampunk",
        foreground: "modules/bossbar/resources/matching-images/steampunk/fg.png",
        bar: "modules/bossbar/resources/matching-images/steampunk/bar.png",
        background: "modules/bossbar/resources/matching-images/steampunk/bg.png",
        type: 1,
    },
]

export function registerSettings() {
    const settings = {
        barStyles: {
            scope: "world",
            config: false,
            type: Array,
            default: [{ ...DEFAULT_BAR_STYLE }, ...PREDEFINED_BAR_STYLES],
            onChange: () => BossBar.update(),
        },

        barPosition: {
            scope: "client",
            type: Object,
            default: {},
        },

        resetPosition: {
            scope: "client",
            config: true,
            type: Boolean,
            default: false,
            onChange: (value) => {
                if (value) BossBar.resetPosition();
            }
        },

        currentHpPath: {
            scope: "world",
            config: true,
            type: String,
            default: "attributes.hp.value",
        },
        maxHpPath: {
            scope: "world",
            config: true,
            type: String,
            default: "attributes.hp.max",
        },
        woundsSystem: {
            scope: "world",
            config: true,
            type: Boolean,
            default: false,
        },
    };

    registerSettingsArray(settings);

    game.settings.registerMenu(MODULE_ID, "BarStyleConfiguration", {
        name: "bossbar.settings.BarStyleConfiguration.name",
        label: "bossbar.settings.BarStyleConfiguration.label",
        icon: "fas fa-paint-brush",
        type: BarStyleConfiguration,
        restricted: true,
    });
}

export function getSetting(key) {
    return SETTING_CACHE[key] ?? game.settings.get(MODULE_ID, key);
}

export async function setSetting(key, value) {
    return await game.settings.set(MODULE_ID, key, value);
}

function registerSettingsArray(settings) {
    for (const [key, value] of Object.entries(settings)) {
        if (!value.name) value.name = `${MODULE_ID}.settings.${key}.name`;
        if (!value.hint) value.hint = `${MODULE_ID}.settings.${key}.hint`;
        if (value.useCache === undefined) value.useCache = DEFAULT_CACHE;
        if (value.useCache) {
            const unwrappedOnChange = value.onChange;
            if (value.onChange)
                value.onChange = (value) => {
                    SETTING_CACHE[key] = value;
                    if (unwrappedOnChange) unwrappedOnChange(value);
                };
        }
        game.settings.register(MODULE_ID, key, value);
        if (value.useCache) SETTING_CACHE[key] = getSetting(key);
    }
}
