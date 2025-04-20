<script lang="ts">
    import { Dialog } from 'bits-ui';
    import Button from '@/lib/components/forms/button/button.svelte';
    import type { Snippet } from 'svelte';
    import { Icon, type IconProps } from '$lib/components/common/icon/index.js';
    import { cn } from '$lib/core/utils/index.js';

    const { Close: DialogClose } = Dialog;

    interface HeaderProps {
        class?: string;
        children: Snippet;
        icon?: string | IconProps;
        color?: string;
    }

    const { children, icon, color = 'primary', ...props }: HeaderProps = $props();
</script>

<div
    class={cn('flex items-center relative gap-(--space-between-sm) bg-white/50', props.class)}
    style:--color={`var(--color-${color})`}>
    {#if icon}
        <div
            class="rounded-full shrink-0 size-12 inline-flex items-center justify-center bg-color/10 text-color"
        >
            <Icon
                name={typeof icon === 'string' ? icon : icon.name}
                size={typeof icon === 'string' ? 24 : icon.size}
                color={typeof icon === 'string' ? undefined : icon.color}
            />
        </div>
    {/if}

    <div>
        {@render children()}
    </div>

    <DialogClose>
        {#snippet child({ props: builder })}
            <Button
                {...builder}
                icon="ph:x"
                variant="ghost"
                size="sm"
                class="size-8 opacity-50 hover:opacity-100 focus-visible:ring-foreground focus-visible:ring-offset-background absolute top-0 right-0 z-10 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden active:scale-98"
                on_click="close_dialog"
            />
            <span class="sr-only">Close</span>
        {/snippet}
    </DialogClose>
</div>
