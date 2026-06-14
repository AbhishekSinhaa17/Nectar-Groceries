export const formatPrice = (n: number): string => `$${n.toFixed(2)}`;

export const delay = <T>(value: T, ms = 0): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export const slugify = (s: string): string =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const unslugify = (s: string): string => s.replace(/-/g, " ").replace(/\band\b/g, "&");
