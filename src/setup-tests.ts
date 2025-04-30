import { afterEach, vi } from 'vitest';

// Mock fetch globally
global.fetch = vi.fn();

// Setup afterEach cleanup
afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    vi.restoreAllMocks();
});

const matchMediaMock = vi.fn((query) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
}));
vi.stubGlobal('matchMedia', matchMediaMock);
