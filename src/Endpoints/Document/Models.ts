import {z} from 'zod'

const DOC_INFO = z.object({
    title: z.string().min(3),
    description: z.string().min(3),
});

type DOC_INFO = z.infer<typeof DOC_INFO>

type FILE_INFO = {
    name: string;
    size: number;
    location: string;
    mimeType: string
}

const SEARCH_STRING = z.string();

const DOCS_STATS = z.object({
    avg_file_size:z.number()
})

export { DOC_INFO,FILE_INFO, SEARCH_STRING }