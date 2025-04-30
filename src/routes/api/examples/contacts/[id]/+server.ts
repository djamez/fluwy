import type { RequestHandler } from '@sveltejs/kit';
import { sleep } from '$lib/core/utils/index.js';

const contacts = [
    {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@mail.com',
        phone: '+1 123 456 7890',
        address: {
            line1: '123 Main St',
            city: 'London',
            country: 'UK',
        },
    },
    {
        id: 2,
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@mail.com',
        phone: '+1 234 567 8901',
        address: {
            line1: '123 Main St',
            city: 'London',
            country: 'UK',
        },
    },
];

export const GET: RequestHandler = async (request) => {
    const contact = contacts.find((contact) => contact.id === Number(request.params.id));
    await sleep(1000);

    if (!contact) {
        return Response.json(
            {
                error: 'Contact not found',
            },
            {
                status: 404,
            }
        );
    }

    return Response.json({
        data: contact,
    });
};
