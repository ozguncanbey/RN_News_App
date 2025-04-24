export interface SortOption {
    label: string;
    value: string;
}

export const SORT_TYPES: SortOption[] = [
    { label: 'Most Recent', value: 'publishedAt' },
    { label: 'Most Popular', value: 'popularity' },
];

export const DEFAULT_SORT_TYPE = 'publishedAt';