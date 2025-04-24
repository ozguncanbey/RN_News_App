// constants/countries.ts

export interface CountryOption {
    label: string;
    value: string; 
}

/**
 * Uygulamada kullanılan ülke seçeneklerinin listesi.
 */
export const COUNTRIES: CountryOption[] = [
    { label: '🇺🇸 United States', value: 'us' },
    { label: '🇬🇧 United Kingdom', value: 'gb' },
    { label: '🇩🇪 Germany', value: 'de' },
    { label: '🇫🇷 France', value: 'fr' },
    { label: '🇹🇷 Turkey', value: 'tr' },
    { label: '🇯🇵 Japan', value: 'jp' },
];

export const DEFAULT_COUNTRY = 'us';