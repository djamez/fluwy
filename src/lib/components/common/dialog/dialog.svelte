<script lang="ts">
    import { Dialog } from 'bits-ui';
    import { onDestroy, onMount } from 'svelte';
    import { DialogEvents, useDialogs } from '@/lib/core/stores/dialogs.js';
    import type { Any, Context, Template } from '@/lib/core/contracts.js';
    import { Render } from '@/lib/core/index.js';
    import { cn, deferred, element } from '@/lib/core/utils/index.js';
    import { Icon, type IconProps } from '@/lib/components/common/icon/index.js';
    import { useContext } from '@/lib/core/context/index.js';
    import { Operation } from '@/lib/core/constants.js';
    import { Events } from '@/lib/core/utils/events/index.js';
    import { app } from '@/lib/index.js';
    import { useCommon } from '@/lib/components/common/styles.js';
    import DialogHeader from './dialog-header.svelte';
    import DialogFooter from './dialog-footer.svelte';

    const { Root, Portal, Overlay, Content, Title, Description } = Dialog;

    interface Props {
        id?: string;
        color?: string;
        title?: Template;
        icon?: string | IconProps;
        description?: Template;
        content?: Template;
        load?: Record<string, Template>;
        footer?: Template;
        class?: string;
    }

    const { color, icon, ...props }: Props = $props();

    let open = $state(false);
    let loading = $state(false);
    let title = $derived(element(props.title));
    let description = $derived(element(props.description));
    let content = $derived(element(props.content));
    let footer = $derived(element(props.footer));
    const dialogs = useDialogs();
    const context = useContext();
    const commonBackground = useCommon('background_color');
    const commonBorderRadius = useCommon('border_radius.lg');
    const commonBorderColor = useCommon('border_color');
    let contentTag: HTMLDivElement | undefined = $state();

    onMount(async () => {
        open = true;

        Events.on(DialogEvents.CLOSE, onCloseEvent);

        await resolveLoaders(props.load || {}, context);

        contentTag!.scrollTop = 0;
    });

    onDestroy(() => {
        Events.removeListener(DialogEvents.CLOSE, onCloseEvent);
    });

    async function resolveLoaders(loadParams: Record<string, Any>, context: Context) {
        if (!Object.keys(loadParams).length) return;

        type LoadOption = {
            if?: Any;
            get?: string;
            post?: string;
        };

        loading = true;

        for (let [varName, operations] of Object.entries(loadParams)) {
            operations = operations as LoadOption;

            try {
                const varValue = await app.handleOperations(operations, context);
                context.set(varName, varValue);
            } catch (rejection) {
                if (rejection === Operation.Cancelled) continue;
                throw rejection;
            }
        }

        loading = false;
    }

    function onCloseEvent(id: string) {
        if (id !== props.id) return;

        onOpenChange((open = false));
    }

    function onOpenChange(isOpen: boolean) {
        if (isOpen) return;

        deferred(() => dialogs.remove(props.id!));
    }

    function onOverlayClick() {
        open = false;
        deferred(() => dialogs.remove(props.id!));
    }
</script>

<Root bind:open {onOpenChange}>
    <Portal>
        <Overlay>
            {#snippet child({ props: builder })}
                <div
                    {...builder}
                    onclick={onOverlayClick}
                    class="z-50 fixed inset-0 bg-black/50 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in"
                ></div>
            {/snippet}
        </Overlay>

        <Content>
            {#snippet child({ props: builder })}
                <div
                    {...builder}
                    bind:this={contentTag}
                    class="fixed inset-0 w-screen overflow-y-auto z-50 !pointer-events-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
                >
                    <div
                        class="grid min-h-full grid-rows-[1fr_auto] sm:grid-rows-[1fr_auto_3fr] p-(--space-inside-lg) justify-items-center">
                        <div
                            class={cn(
                                commonBackground,
                                commonBorderRadius,
                                commonBorderColor,
                                'border p-(--space-inside-dialogs) space-y-(--space-between-fields) overflow-hidden row-start-2 relative pointer-events-auto flex flex-col z-50 w-full sm:max-w-[490px]'
                            )}
                        >
                            {#if loading}
                                <div
                                    class="absolute inset-0 z-20 flex items-center justify-center bg-white/90 backdrop-blur-xs">
                                    <Icon name="svg-spinners:90-ring-with-bg" size={40} class="text-neutral-500" />
                                </div>
                            {:else}
                                {#if title.content || description.content}
                                    <DialogHeader {icon} {color}>
                                        {#if title.content}
                                            <Title
                                                class={cn('flex w-full items-center text-lg font-semibold tracking-tight', title.class)}
                                            >
                                                <Render props={title.content} />
                                            </Title>
                                        {/if}
                                        {#if description.content}
                                            <Description
                                                class={cn('text-muted-foreground text-xs', description.class)}>
                                                <Render props={description.content} />
                                            </Description>
                                        {/if}
                                    </DialogHeader>
                                {/if}

                                {#if content.content}
                                    <div class={cn('flex flex-col gap-(--space-between-fields)', content.class)}>
                                        <Render props={content.content} />
                                    </div>
                                {/if}

                                {#if footer.content}
                                    <DialogFooter class={footer.class}>
                                        <Render props={footer.content} />
                                    </DialogFooter>
                                {/if}
                            {/if}
                        </div>
                    </div>
                </div>
            {/snippet}
        </Content>
    </Portal>
</Root>
