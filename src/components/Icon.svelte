<script lang="ts">
    /** @type {string}*/
    export let name: string
    export let viewBox: string = "0 0 100 100"
    export let width: string | undefined = undefined
    export let height: string | undefined = undefined
</script>

<svg class="icon {$$restProps.class || ''}" {viewBox} {width} {height}>
    <use xlink:href="/icons.svg#{name}"></use>
</svg>