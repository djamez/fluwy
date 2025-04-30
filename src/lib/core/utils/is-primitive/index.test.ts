import { describe, expect, it } from 'vitest';
import { isPrimitive } from './index.js';

describe('isPrimitive', () => {
    it('should return true for string values', () => {
        expect(isPrimitive('')).toBe(true);
        expect(isPrimitive('hello')).toBe(true);
    });

    it('should return true for number values', () => {
        expect(isPrimitive(0)).toBe(true);
        expect(isPrimitive(42)).toBe(true);
        expect(isPrimitive(-1.5)).toBe(true);
        expect(isPrimitive(NaN)).toBe(true);
    });

    it('should return true for boolean values', () => {
        expect(isPrimitive(true)).toBe(true);
        expect(isPrimitive(false)).toBe(true);
    });

    it('should return true for null and undefined', () => {
        expect(isPrimitive(null)).toBe(true);
        expect(isPrimitive(undefined)).toBe(true);
    });

    it('should return false for non-primitive values', () => {
        expect(isPrimitive({})).toBe(false);
        expect(isPrimitive([])).toBe(false);
        expect(isPrimitive(() => {})).toBe(false);
        expect(isPrimitive(new Date())).toBe(false);
        expect(isPrimitive(new RegExp(''))).toBe(false);
    });
});