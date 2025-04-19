import type { IconProps } from '@/lib/components/common/icon/types.js';
import type { Any, Component, ElementProps, Template } from '@/lib/core/contracts.js';
import type { Snippet } from 'svelte';

export interface ButtonProps extends ElementProps {
    text?: string;
    type?: 'submit' | 'reset' | 'button';
    icon?: IconProps | string;
    trailing_icon?: IconProps | string;
    loading?: boolean;
    disabled?: boolean | string | Template;
    class?: string;
    variant?: string;
    size?: string;
    color?: string;
    on_click?: Any;
    onclick?: () => Any;
    autofocus?: boolean;
    component?: Partial<Component>;
    children?: Snippet;
}
