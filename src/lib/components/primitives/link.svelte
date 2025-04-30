<script lang="ts">
    import { compile, useTheme } from '@/lib/core/utils/index.js';
    import type { Any, ElementProps } from '@/lib/core/contracts.js';
    import { Render, useContext } from '@/lib/core/index.js';
    import { cn, exclude } from '@/lib/core/utils/index.js';
    import { Typography } from './styles.js';

    interface LinkProps extends ElementProps {
        class?: string;
        url: string;
        open_new_tab?: boolean;
        content?: Any;
    }

    const context = useContext();
    const props: LinkProps = $props();
    const linkTheme = useTheme('typography.link');
    const compiledUrl = $derived(props.url ? compile(props.url, context.data) : undefined);
</script>

<a href={compiledUrl} class={cn(Typography.link, linkTheme, props.class)} target={props.open_new_tab ? '_blank' : ''}>
    <Render props={exclude(props, 'url', 'open_new_tab')} />
</a>
