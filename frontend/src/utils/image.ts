
// clean up prefex stuff from url sometimes coming from api
export function normalizeImageUrl(raw?: string | null): string | undefined {
    if (!raw) return undefined;

    const url = raw.trim();

    //if weird string comes from api, only accept http/https URLs
    if (!/^https?:\/\//i.test(url)) return undefined;


    return url;
}

//clean up when api returns 2 urls
export function pickFirstValidImageUrl(
    ...somestuff: Array<string|null|undefined>
): string  | undefined {
    for (const stuff of somestuff) {
        const normalized = normalizeImageUrl(stuff);
        if(normalized) return normalized;
    }
    return undefined;
}