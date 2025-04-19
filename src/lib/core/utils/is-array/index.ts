import type { Template } from '$lib/core/contracts.js';

export function isArray(props: Template): boolean {
    if (!props) return false;
    const array = Boolean(Array.isArray(props) || props['0']);

    return array && typeof props !== 'string';
}
