<script lang="ts">
    import { mode } from 'mode-watcher';

    interface StringMode {
        light: string;
        dark: string;
    }

    interface ImageProps {
        class?: string;
        src: string | StringMode;
        alt?: string;
    }

    const props: ImageProps = $props();
    const hasMode = $derived(typeof props.src === 'object');
    const src = $derived(() => {
        if (!hasMode) return props.src as string;

        return (props.src as StringMode)[mode.current ?? 'light'];
    });
</script>

<img src={src()} alt={props.alt} class={props.class} />
