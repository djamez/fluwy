import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Any } from '../contracts.js';
import { Durations } from '../constants.js';
import type { TransitionConfig } from 'svelte/transition';
import { cubicOut } from 'svelte/easing';
import _ from 'lodash';
import { expandObject } from './normalize-object/index.js';
import { getContext } from 'svelte';
import { get } from '@/lib/core/utils/get/index.js';
import { mergeObjects } from '@/lib/core/utils/merge-objects/index.js';

export { Random } from './random/index.js';
export { parseUriParams } from './parsers/parse-uri-params.js';
export { str } from './str/index.js';
export { delay } from './delay/index.js';
export { get } from './get/index.js';
export { abort } from './abort/index.js';
export { compile } from './compile/index.js';
export { isPrimitive } from './is-primitive/index.js';
export { isArray } from './is-array/index.js';
export { element } from '$lib/core/utils/element/index.js';
export const { cloneDeep } = _;

export { expandObject };

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
    y?: number;
    x?: number;
    start?: number;
    duration?: number;
};

export const flyAndScale = (
    node: Element,
    params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 100 }
): TransitionConfig => {
    const style = getComputedStyle(node);
    const transform = style.transform === 'none' ? '' : style.transform;

    const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
        const [minA, maxA] = scaleA;
        const [minB, maxB] = scaleB;

        const percentage = (valueA - minA) / (maxA - minA);
        return percentage * (maxB - minB) + minB;
    };

    const styleToString = (style: Record<string, number | string | undefined>): string => {
        return Object.keys(style).reduce((str, key) => {
            if (style[key] === undefined) return str;
            return str + `${key}:${style[key]};`;
        }, '');
    };

    return {
        duration: params.duration ?? 100,
        delay: 0,
        easing: cubicOut,
        css: (t) => {
            const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
            const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
            const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

            return styleToString({
                transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                opacity: t,
            });
        },
    };
};

export const withClasses = (props: { class?: string } | Any[], initialClasses: string) =>
    Array.isArray(props) ? initialClasses : `${initialClasses} ${props.class}`;

export function titleToCamelCase(titleCaseString: string): string {
    // Split the string into words
    const words = titleCaseString
        .replace(/_+/g, ' ')
        .split(' ')
        .map((word) => word.toLowerCase());

    // Convert the first word to lowercase
    let camelCaseString = words[0];

    // Convert the first character of each subsequent word to uppercase and append to the camelCaseString
    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        camelCaseString += word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }

    return camelCaseString;
}

export function hasBrackets(str: string) {
    return str.includes('[') && str.includes(']');
}

export function set(record: Record<string, Any>, path: string, value: Any): void {
    const keys = path.split('.');
    let current = record;

    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];

        if (!(key in current)) {
            current[key] = {};
        }

        current = current[key] as Record<string, Any>;
    }

    current[keys[keys.length - 1]] = value;
}

export function isNil(value: Any) {
    return [undefined, null, NaN].includes(value);
}

export function has(obj: Record<string, unknown>, path: string): boolean {
    const keys = path.split('.');
    let current = obj;

    for (const key of keys) {
        if (!(key in current)) return false;
        current = current[key] as Record<string, unknown>;
    }

    return true;
}

export function exclude(props: Any, ...keys: string[]): Any {
    const result = { ...props };

    for (const key of keys) {
        delete result[key];
    }

    return result;
}

export function deferred(fn: () => void, duration = Durations.transition) {
    setTimeout(fn, duration);
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useTheme(key: string, defaultValue?: Any): Any {
    const theme: Any = getContext('theme');

    return get(theme, key, defaultValue);
}

export function mergeThemes(key: string, defaultValue: Any) {
    const theme: Any = getContext('theme');

    return mergeObjects(defaultValue, get(theme, key, defaultValue));
}
