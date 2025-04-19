import { describe, expect, it } from 'vitest';
import { element } from './index.js';

describe('template', () => {
    it('wraps primitive values in content property', () => {
        expect(element('hello')).toEqual({ content: 'hello' });
        expect(element(123)).toEqual({ content: 123 });
        expect(element(true)).toEqual({ content: true });
        expect(element(null)).toEqual({ content: null });
        expect(element(undefined)).toEqual({ content: undefined });
    });

    it('wraps arrays in content property', () => {
        const arr = ['hello', 'world'];
        expect(element(arr)).toEqual({ content: arr });
    });

    it('returns object as is when given an object', () => {
        const obj = { class: 'btn', content: 'Click me' };
        expect(element(obj)).toEqual(obj);
    });

    it('handles empty object', () => {
        expect(element({})).toEqual({ content: {} });
    });
});
