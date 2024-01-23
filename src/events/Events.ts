export type EventMap = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- required for Events class
    [key: string]: (...args: any[]) => void;
};

interface IEventsStorage<Events extends EventMap> extends Record<keyof Events, Events[keyof Events][]> {}

/**
 * Простейший класс для работы с событиями
 */
export class Events<Events extends EventMap> {
    private events: IEventsStorage<Events> = {};

    public subscribe<E extends keyof Events>(event: E, callback: Events[E]) {
        if (!this.events[event]) {
            this.events[event] = [] as IEventsStorage<Events>[E];
        }
        this.events[event].push(callback);
    }

    public unsubscribe<E extends keyof Events>(event: E, callback: Events[E]) {
        if (!this.events[event]) {
            return;
        }
        this.events[event] = this.events[event].filter((fn) => fn !== callback);
    }

    public emit<E extends keyof Events>(event: E, args: Parameters<Events[E]>) {
        if (!this.events[event]) {
            return;
        }
        this.events[event].forEach((fn) => fn(...args));
    }

    public clear() {
        this.events = {};
    }
}