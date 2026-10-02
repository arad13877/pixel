export function validateSeo(directory?: string, options?: { http?: boolean; baseUrl?: string }): Promise<{ indexable: number; noindex: number; sitemap: number; http: string }>;
