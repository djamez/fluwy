import { createContext } from '@/lib/core/context/index.js';
import type { Template } from '@/lib/core/contracts.js';
import { if_expression, parseCondition, type Condition, evaluateBoolean } from '@/lib/core/controls/condition/index.js';
import { describe, expect, it } from 'vitest';

describe('if condition parser', () => {
    describe('check for example: if response.status == 200', () => {
        describe('.check', () => {
            it('returns true when expression starts with "if "', () => {
                expect(if_expression.check('if response.status == 200')).toBe(true);
            });

            it('returns false when doesnt start with "if "', () => {
                expect(if_expression.check('response.status == 200')).toBe(false);
            });
        });

        describe('.evaluate', () => {
            it('evaluates to true', () => {
                const context = createContext({
                    response: { status: 200 },
                });

                expect(if_expression.evaluate('if response.status == 200', context)).toBe(true);
            });

            it('evaluates to false', () => {
                const context = createContext({
                    response: { status: 200 },
                });

                expect(if_expression.evaluate('if response.status == 404', context)).toBe(false);
            });

            it('also evaluates to false when checking for strings', () => {
                const context = createContext({
                    response: { status: 200 },
                });

                expect(if_expression.evaluate('if response.status == "200"', context)).toBe(false);
                expect(if_expression.evaluate("if response.status == '200'", context)).toBe(false);
            });

            it('also supports "is" keyword', () => {
                const context = createContext({
                    response: { status: 200 },
                });

                expect(if_expression.evaluate('if response.status is 200', context)).toBe(true);
            });

            it('also supports "is not" keywords', () => {
                const context = createContext({
                    response: { status: 200 },
                });

                expect(if_expression.evaluate('if response.status is not 200', context)).toBe(false);
                expect(if_expression.evaluate('if response.status is not 400', context)).toBe(true);
            });

            it('also supports "!=" operator', () => {
                const context = createContext({
                    response: { status: 200 },
                });

                expect(if_expression.evaluate('if response.status != 200', context)).toBe(false);
                expect(if_expression.evaluate('if response.status != 400', context)).toBe(true);
            });

            it('supports "and" concatenation of expressions', () => {
                const context = createContext({
                    response: { status: 200 },
                    valid: true,
                    name: 'Marco',
                });

                expect(if_expression.evaluate('if response.status == 200 and valid', context)).toBe(true);
                expect(if_expression.evaluate('if response.status is 200 and name is "Marco"', context)).toBe(true);
                expect(if_expression.evaluate('if response.status == 200 and name is "Marco"', context)).toBe(true);
                expect(if_expression.evaluate('if response.status is 200 and name == "Marco"', context)).toBe(true);
                expect(if_expression.evaluate('if response.status is 200 and name is not "Marco"', context)).toBe(
                    false
                );
                expect(if_expression.evaluate('if response.status == 200 and name != "Marco"', context)).toBe(false);
                expect(if_expression.evaluate('if name is "Marco" and valid is not false', context)).toBe(true);
                expect(if_expression.evaluate('if name is "Marco" and valid != false', context)).toBe(true);
                expect(if_expression.evaluate('if name is "Marco" and valid is true', context)).toBe(true);
                expect(if_expression.evaluate('if name is "Marco" and valid == true', context)).toBe(true);
            });

            it('supports && operator (and operator)', () => {
                const context = createContext({
                    response: { status: 200 },
                    valid: true,
                    name: 'Marco',
                });

                expect(if_expression.evaluate('if response.status == 200 && valid', context)).toBe(true);
                expect(if_expression.evaluate('if response.status is 200 && name is "Marco"', context)).toBe(true);
                expect(if_expression.evaluate('if response.status == 200 && name is "Marco"', context)).toBe(true);
                expect(if_expression.evaluate('if response.status is 200 && name == "Marco"', context)).toBe(true);
                expect(if_expression.evaluate('if response.status is 200 && name is not "Marco"', context)).toBe(false);
                expect(if_expression.evaluate('if response.status == 200 && name != "Marco"', context)).toBe(false);
                expect(if_expression.evaluate('if name is "Marco" && valid is not false', context)).toBe(true);
                expect(if_expression.evaluate('if name is "Marco" && valid != false', context)).toBe(true);
                expect(if_expression.evaluate('if name is "Marco" && valid is true', context)).toBe(true);
                expect(if_expression.evaluate('if name is "Marco" && valid == true', context)).toBe(true);
            });

            it('supports unlimited "and" concatenations with mixed operators', () => {
                const context = createContext({
                    response: {
                        status: 200,
                        type: 'success',
                        headers: {
                            'content-type': 'application/json',
                        },
                    },
                    name: 'Marco',
                    valid: true,
                    age: 25,
                    settings: {
                        enabled: true,
                        mode: 'dark',
                    },
                });

                expect(
                    if_expression.evaluate('if response.status == 200 and name is "Marco" and valid is true', context)
                ).toBe(true);

                expect(
                    if_expression.evaluate(
                        'if response.status == 200 and name is "Marco" and valid and settings.enabled',
                        context
                    )
                ).toBe(true);

                expect(
                    if_expression.evaluate(
                        'if response.status == 200 and name is "Marco" and valid and settings.enabled and settings.mode is "dark"',
                        context
                    )
                ).toBe(true);

                expect(
                    if_expression.evaluate(
                        'if response.type is "success" and response.headers.content-type is "application/json" and age != 30 and settings.mode is not "light" and valid',
                        context
                    )
                ).toBe(true);
            });

            it('supports type-specific comparisons', () => {
                const context = createContext({
                    response: { type: 'success' },
                    settings: {
                        mode: 'dark',
                        enabled: true,
                    },
                    age: 25,
                    valid: true,
                });

                // String comparisons
                expect(if_expression.evaluate('if response.type is "success"', context)).toBe(true);
                expect(if_expression.evaluate('if settings.mode == "dark"', context)).toBe(true);

                // Numeric comparisons
                expect(if_expression.evaluate('if age == 25', context)).toBe(true);
                expect(if_expression.evaluate('if age is 25', context)).toBe(true);

                // Boolean values
                expect(if_expression.evaluate('if valid', context)).toBe(true);
                expect(if_expression.evaluate('if settings.enabled is true', context)).toBe(true);
                expect(if_expression.evaluate('if settings.enabled == true', context)).toBe(true);
                expect(if_expression.evaluate('if settings.enabled != "true"', context)).toBe(true);
            });

            it('supports greater/less than comparisons', () => {
                const context = createContext({
                    age: 25,
                    score: 85.5,
                });

                expect(if_expression.evaluate('if age > 20', context)).toBe(true);
                expect(if_expression.evaluate('if age >= 25', context)).toBe(true);
                expect(if_expression.evaluate('if age < 30', context)).toBe(true);
                expect(if_expression.evaluate('if age <= 25', context)).toBe(true);
                expect(if_expression.evaluate('if score > 80', context)).toBe(true);
                expect(if_expression.evaluate('if score <= 85.5', context)).toBe(true);
            });

            it('supports array contains/includes checks', () => {
                const context = createContext({
                    settings: {
                        features: ['a', 'b', 'c'],
                    },
                    permissions: ['read', 'write'],
                    items: [1, 2, 3, 4],
                });

                expect(if_expression.evaluate('if "b" in settings.features', context)).toBe(true);
                expect(if_expression.evaluate('if "d" in settings.features', context)).toBe(false);
                expect(if_expression.evaluate('if "write" in permissions', context)).toBe(true);
                expect(if_expression.evaluate('if 3 in items', context)).toBe(true);
            });

            it('supports "or" operator', () => {
                const context = createContext({
                    age: 25,
                    name: 'Marco',
                });

                expect(if_expression.evaluate('if age == 25 or age == 30', context)).toBe(true);
                expect(if_expression.evaluate('if name is "John" or name is "Marco"', context)).toBe(true);
                expect(if_expression.evaluate('if age < 20 or age > 24', context)).toBe(true);
            });

            it('supports || operator (or operator)', () => {
                const context = createContext({
                    age: 25,
                    name: 'Marco',
                });

                expect(if_expression.evaluate('if age == 25 || age == 30', context)).toBe(true);
                expect(if_expression.evaluate('if name is "John" || name is "Marco"', context)).toBe(true);
                expect(if_expression.evaluate('if age < 20 || age > 24', context)).toBe(true);
            });

            it('supports "or" or "||" operator for multiple conditions', () => {
                const context = createContext({
                    age: 25,
                    name: 'Marco',
                });

                expect(
                    if_expression.evaluate('if age == 25 or age == 30 or name is "John" or name is "Marco"', context)
                ).toBe(true);
                expect(
                    if_expression.evaluate('if age < 20 || age > 24 || name is "John" || name is "Marco"', context)
                ).toBe(true);
            });

            it('supports combination of "and", "&&", "or" and "||" operators', () => {
                const context = createContext({
                    a: 'a',
                    b: 'b',
                    name: 'John',
                });

                expect(
                    if_expression.evaluate(
                        'if (a == "a" and b == "b" && a != b) and (name is "Jane" || name is "John" or a == "a")',
                        context
                    )
                ).toBe(true);
            });

            it('supports "not" operator', () => {
                const context = createContext({
                    valid: true,
                    age: 25,
                    permissions: ['read', 'write'],
                });

                expect(if_expression.evaluate('if not valid is false', context)).toBe(true);
                expect(if_expression.evaluate('if not (age < 20)', context)).toBe(true);
                expect(if_expression.evaluate('if not ("admin" in permissions)', context)).toBe(true);
            });

            it('supports property existence checks', () => {
                const context = createContext({
                    response: {
                        status: 200,
                        headers: {
                            'content-type': 'application/json',
                        },
                    },
                });

                expect(if_expression.evaluate('if "status" in response', context)).toBe(true);
                expect(if_expression.evaluate('if "unknown" in response', context)).toBe(false);
                expect(if_expression.evaluate('if "content-type" in response.headers', context)).toBe(true);
            });

            it('supports null/undefined checks', () => {
                const context = createContext({
                    response: {
                        data: null,
                    },
                    settings: {
                        mode: 'dark',
                    },
                    name: 'Marco',
                });

                expect(if_expression.evaluate('if response.data is null', context)).toBe(true);
                expect(if_expression.evaluate('if response.data is undefined', context)).toBe(false);
                expect(if_expression.evaluate('if settings.config is undefined', context)).toBe(true);
                expect(if_expression.evaluate('if settings.config is null', context)).toBe(false);
                expect(if_expression.evaluate('if settings.unexisting is undefined', context)).toBe(true);
                expect(if_expression.evaluate('if settings.config is nil', context)).toBe(true);
                expect(if_expression.evaluate('if response.data is nil', context)).toBe(true);
                expect(if_expression.evaluate('if settings.unexisting is nil', context)).toBe(true);
                expect(if_expression.evaluate('if name is not null', context)).toBe(true);
                expect(if_expression.evaluate('if settings.mode is not undefined', context)).toBe(true);
            });

            it('supports parentheses for grouping', () => {
                const context = createContext({
                    age: 25,
                    name: 'Marco',
                });

                expect(if_expression.evaluate('if (age > 20 and age < 30) or name is "Marco"', context)).toBe(true);
                expect(if_expression.evaluate('if not (age < 20 or age > 30)', context)).toBe(true);
                expect(
                    if_expression.evaluate(
                        'if (name is "Marco" and age == 25) or (name is "John" and age == 30)',
                        context
                    )
                ).toBe(true);
            });

            it('supports nested properties comparison', () => {
                const context = createContext({
                    valid_status: 200,
                    response: {
                        status: 200,
                    },
                });

                expect(if_expression.evaluate('if valid_status == response.status', context)).toBe(true);
            });
        });
    });

    describe('parsing conditions from element', () => {
        const context = createContext({
            response: { status: 200 },
            user: { name: 'Marco', age: 30 },
            permissions: ['read', 'write'],
        });

        describe('basic conditions', () => {
            const testCases: ConditionTestCase = {
                'returns if template when condition is true': {
                    condition: {
                        'if response.status is 200': {
                            text: 'if satisfied',
                        },
                        else: {
                            text: 'else satisfied',
                        },
                    },
                    template: {
                        text: 'if satisfied',
                    },
                },
                'returns else template when condition is false': {
                    condition: {
                        'if response.status is not 200': {
                            text: 'if satisfied',
                        },
                        else: {
                            text: 'else satisfied',
                        },
                    },
                    template: {
                        text: 'else satisfied',
                    },
                },
                'returns if template when else is not provided and condition is true': {
                    condition: {
                        'if response.status is 200': {
                            text: 'if satisfied',
                        },
                    },
                    template: {
                        text: 'if satisfied',
                    },
                },
                'returns undefined when else is not provided and condition is false': {
                    condition: {
                        'if response.status is not 200': {
                            text: 'if satisfied',
                        },
                    },
                    template: undefined,
                },
            };

            Object.entries(testCases).forEach(([testCaseDescription, { condition, template }]) => {
                it(testCaseDescription, () => {
                    expect(parseCondition(condition, context)).toEqual(template);
                });
            });
        });

        describe('complex conditions', () => {
            const testCases: ConditionTestCase = {
                'supports logical operators': {
                    condition: {
                        'if response.status is 200 and user.name is "Marco"': {
                            text: 'if satisfied',
                        },
                        else: {
                            text: 'else satisfied',
                        },
                    },
                    template: {
                        text: 'if satisfied',
                    },
                },
                'supports numeric comparisons': {
                    condition: {
                        'if user.age > 25': {
                            text: 'if satisfied',
                        },
                        else: {
                            text: 'else satisfied',
                        },
                    },
                    template: {
                        text: 'if satisfied',
                    },
                },
                'supports in operator': {
                    condition: {
                        'if "read" in permissions': {
                            text: 'if satisfied',
                        },
                        else: {
                            text: 'else satisfied',
                        },
                    },
                    template: {
                        text: 'if satisfied',
                    },
                },
                'supports else if conditions (1/2)': {
                    condition: {
                        'if response.status is 400': {
                            text: 'if satisfied',
                        },
                        'else if user.age > 25': {
                            text: 'first else if satisfied',
                        },
                        'else if response.status is 200': {
                            text: 'second else if satisfied',
                        },
                        else: {
                            text: 'else satisfied',
                        },
                    },
                    template: {
                        text: 'first else if satisfied',
                    },
                },
                'supports else if conditions (2/2)': {
                    condition: {
                        'if response.status is 400': {
                            text: 'if satisfied',
                        },
                        'else if user.age == 25': {
                            text: 'first else if satisfied',
                        },
                        'else if response.status is 200': {
                            text: 'second else if satisfied',
                        },
                        else: {
                            text: 'else satisfied',
                        },
                    },
                    template: {
                        text: 'second else if satisfied',
                    },
                },
            };

            Object.entries(testCases).forEach(([testCaseDescription, { condition, template }]) => {
                it(testCaseDescription, () => {
                    expect(parseCondition(condition, context)).toEqual(template);
                });
            });
        });

        describe('error cases', () => {
            it('throws error when no if condition is found', () => {
                expect(() => parseCondition({ else: { text: 'else' } }, context)).toThrow('No if condition found');
            });

            it('throws error when multiple if conditions are provided', () => {
                expect(() =>
                    parseCondition(
                        {
                            'if response.status is 200': { text: 'first' },
                            'if user.age > 25': { text: 'second' },
                        },
                        context
                    )
                ).toThrow();
            });
        });

        type ConditionTestCase = {
            [testCaseName: string]: {
                condition: Condition;
                template: Template;
            };
        };
    });

    describe('evaluateBoolean', () => {
        describe('string expressions', () => {
            it('evaluates string boolean expressions', () => {
                const context = createContext({
                    age: 25,
                });

                expect(evaluateBoolean('age > 18', context)).toBe(true);
                expect(evaluateBoolean('age < 18', context)).toBe(false);
            });

            it('evaluates complex string expressions', () => {
                const context = createContext({
                    age: 25,
                    valid: true,
                });

                expect(evaluateBoolean('age >= 21 && valid', context)).toBe(true);
                expect(evaluateBoolean('age < 21 || !valid', context)).toBe(false);
            });
        });

        describe('object templates with conditions', () => {
            it('evaluates simple if condition in object', () => {
                const context = createContext({
                    valid: true,
                });

                const template = {
                    'if valid': true,
                    else: false,
                };
                expect(evaluateBoolean(template, context)).toBe(true);
            });

            it('evaluates nested if conditions', () => {
                const context = createContext({
                    user: {
                        isAdmin: true,
                        age: 25,
                    },
                });

                const template = {
                    'if user.age > 18': {
                        'if user.isAdmin': true,
                        else: false,
                    },
                    else: false,
                };
                expect(evaluateBoolean(template, context)).toBe(true);
            });

            it('evaluates else if conditions', () => {
                const context = createContext({
                    user: {
                        isAdmin: true,
                        age: 25,
                    },
                });

                const template = {
                    'if user.age > 30': true,
                    'else if user.isAdmin': true,
                    else: false,
                };
                expect(evaluateBoolean(template, context)).toBe(true);
            });
        });

        describe('primitive values', () => {
            it('returns boolean values as-is', () => {
                const context = createContext({});

                expect(evaluateBoolean(true, context)).toBe(true);
                expect(evaluateBoolean(false, context)).toBe(false);
            });

            it('returns false for null and undefined', () => {
                const context = createContext({});

                expect(evaluateBoolean(null, context)).toBe(false);
                expect(evaluateBoolean(undefined, context)).toBe(false);
            });
        });

        describe('error cases', () => {
            it('throws error for unsupported types', () => {
                const context = createContext({});

                expect(() => evaluateBoolean(123, context)).toThrow('Unsupported value [123] of type: number');
                expect(() => evaluateBoolean([1, 2, 3], context)).toThrow('Unsupported value [1,2,3] of type: object');
            });
        });
    });
});
