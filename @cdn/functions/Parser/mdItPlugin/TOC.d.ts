import { PluginWithOptions } from "markdown-it";
interface TOCOptions {
    tocMarker?: string;
    tocClass?: string;
    firstLevel?: number;
    lastLevel?: number;
    slugify?: (title: string) => string;
}
declare const tocPlugin: PluginWithOptions<TOCOptions>;
export default tocPlugin;
