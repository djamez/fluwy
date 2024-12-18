import { beforeEach, describe, expect, it } from 'vitest';
import { extract } from './index.js';
import { createContext, type Context } from '../../context/index.js';

describe('extract operation', () => {
    let context: Context;

    beforeEach(() => {
        context = createContext();
    });

    const previousResult = {
        id: 1,
        createdAt: new Date(),
        attributes: {
            name: 'John Doe',
            email: 'john.doe@mail.com',
            phone: '1234567890',
            address: {
                line1: '123 Main St',
                country: 'US',
            },
        },
    };

    it('extracts the data based on the map', async () => {
        // Given
        const map = {
            id: 'id',
            name: 'attributes.name',
            email: 'attributes.email',
        };

        // When
        const result = await extract(map, { context, previousResult });

        // Then
        expect(result).toEqual({
            id: 1,
            name: 'John Doe',
            email: 'john.doe@mail.com',
        });
    });

    it('also returns expanded objects if the mapping nested objects with dot notation', async () => {
        // Given
        const map = {
            id: 'id',
            name: 'attributes.name',
            'contact.name': 'attributes.name',
            'contact.email': 'attributes.email',
        };

        // When
        const result = await extract(map, { context, previousResult });

        // Then
        expect(result).toEqual({
            id: 1,
            name: 'John Doe',
            contact: {
                name: 'John Doe',
                email: 'john.doe@mail.com',
            },
        });
    });
});
