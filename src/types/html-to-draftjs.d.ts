declare module 'html-to-draftjs' {
    import { ContentBlock, EntityMap } from 'draft-js';

    interface HtmlToDraftResult {
        contentBlocks: ContentBlock[];
        entityMap: EntityMap;
    }

    export default function htmlToDraft(html: string): HtmlToDraftResult;
} 