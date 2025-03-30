<script lang="ts">
    import { DropdownMenu } from 'bits-ui';
    import { Render } from '@/lib/core/index.js';
    import { cn, flyAndScale } from '@/lib/core/utils/index.js';
    import { useTheme } from '@/lib/core/utils/index.js';
    import { Dropdown } from './styles.js';
    import type { Any } from '@/lib/core/contracts.js';
    import { useCommon } from '../styles.js';

    interface DropdownProps {
        align?: 'start' | 'center' | 'end';
        trigger: Any;
        content: Any;
        class?: string;
    }

    const props: DropdownProps = $props();
</script>

<div class={cn('inline-flex', props.class)}>
    <DropdownMenu.Root>
        <DropdownMenu.Trigger>
            {#snippet child({ props: builder })}
                <div role="button" {...builder}>
                    <Render props={props.trigger} />
                </div>
            {/snippet}
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
            <DropdownMenu.Content
                align={props.align}
                sideOffset={2}
                forceMount
                class={cn(
                    useCommon('border_color'),
                    useCommon('foreground_color'),
                    useCommon('border_radius.lg'),
                    Dropdown.Content,
                    useTheme('common.dropdown.content')
                )}
            >
                {#snippet child({ wrapperProps, props: bitsProps, open })}
                    {#if open}
                        <div {...wrapperProps}>
                            <div {...bitsProps} transition:flyAndScale>
                                <DropdownMenu.Group>
                                    <Render props={props.content} />
                                </DropdownMenu.Group>
                            </div>
                        </div>
                    {/if}
                {/snippet}
            </DropdownMenu.Content>
        </DropdownMenu.Portal>
    </DropdownMenu.Root>
</div>
