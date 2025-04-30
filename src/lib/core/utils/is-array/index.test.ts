import { describe, expect, it } from 'vitest';
import { isArray } from './index.js';

describe('isArray', () => {
    it('returns true for standard arrays', () => {
        expect(isArray([])).toBe(true);
        expect(isArray(['a', 'b', 'c'])).toBe(true);
    });

    it('returns true for objects with numeric keys starting from 0', () => {
        expect(isArray({ '0': 'first', '1': 'second' })).toBe(true);
        expect(isArray({ '0': { content: 'item' } })).toBe(true);
    });

    it('returns false for strings', () => {
        expect(isArray('not an array')).toBe(false);
        expect(isArray('0')).toBe(false);
    });

    it('returns false for regular objects', () => {
        expect(isArray({})).toBe(false);
        expect(isArray({ key: 'value' })).toBe(false);
        expect(isArray({ '1': 'value' })).toBe(false); // No '0' key
    });

    it('returns false for null and undefined', () => {
        expect(isArray(null as never)).toBe(false);
        expect(isArray(undefined as never)).toBe(false);
    });

    it('returns false for other primitive types', () => {
        expect(isArray(123 as never)).toBe(false);
        expect(isArray(true as never)).toBe(false);
    });
});
