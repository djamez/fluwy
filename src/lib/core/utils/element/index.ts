import { isPrimitive, isArray } from '$lib/core/utils/index.js';
import type { ElementProps, Template } from '$lib/core/contracts.js';

export function element(props: Template): ElementProps {
    if (isPrimitive(props) || isArray(props)) return { content: props };
    if (typeof props === 'object' && 'content' in props) return props;

    return { content: props };
}
