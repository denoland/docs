export function HeaderAnchor(props: { id: string }) {
    return (
        <a className="header-anchor" href={`#${props.id}`}>
            <span className="sr-only">Jump to heading</span>
            <span
                aria-hidden="true"
                class="anchor-end"
            >
                #
            </span>
        </a>
    );
}
