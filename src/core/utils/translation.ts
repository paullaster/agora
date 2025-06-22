/* eslint-disable @typescript-eslint/no-explicit-any */

export function getTranslation<T extends Record<string, any>>(
    obj: T,
    fields: (keyof T)[],
    lang: string = 'en',
    fallback: string = 'en'
): T {
    const result = { ...obj };
    for (const field of fields) {
        const value = obj[field];
        if (value && typeof value === 'object' && value.en && value.fr) {
            result[field] = value[lang] || value[fallback] || value.en || value.fr || '';
        }
    }
    return result;
}

export function deepTranslate(obj: any, lang: string = 'en', fallback: string = 'en'): any {
    if (obj && typeof obj === 'object') {
        if ('en' in obj && 'fr' in obj) {
            return obj[lang] || obj[fallback] || obj.en || obj.fr || '';
        }
        const result: any = Array.isArray(obj) ? [] : {};
        for (const key in obj) {
            result[key] = deepTranslate(obj[key], lang, fallback);
        }
        return result;
    }
    return obj;
}

export function negotiateLanguage(header?: string, queryLang?: string): 'en' | 'fr' {
    if (queryLang && ['en', 'fr'].includes(queryLang)) return queryLang as 'en' | 'fr';
    if (!header) return 'en';
    const lower = header.toLowerCase();
    if (lower.startsWith('fr')) return 'fr';
    return 'en';
}

