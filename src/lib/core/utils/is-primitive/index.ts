import type { Template } from '$lib/core/contracts.js';

export function isPrimitive(value: Template): boolean {
    return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        value === null ||
        value === undefined
    );
}
