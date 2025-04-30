<script lang="ts">
    import { useCommon } from '@/lib/components/common/styles.js';
    import { cn } from '@/lib/core/utils/index.js';
    import type { Snippet } from 'svelte';

    interface FooterProps {
        class?: string;
        children: Snippet;
    }

    const { children, ...props }: FooterProps = $props();

    const commonBackgroundColor = useCommon('background_color');
</script>

<div class={cn(commonBackgroundColor, 'flex w-full justify-end gap-(--space-between-sm)', props.class)}>
    {@render children()}
</div>
