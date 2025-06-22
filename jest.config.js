/** @type {import('jest').Config} */
export default {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    transform: {
        '^.+\\.ts$': ['ts-jest', { useESM: true }],
    },
    // Remove deprecated globals, ts-jest reads tsconfig automatically
    testMatch: ['<rootDir>/test/**/*.test.ts', '<rootDir>/test/**/*.test.js', '<rootDir>/test/**/*.test.mjs'],
    moduleFileExtensions: ['ts', 'js', 'mjs', 'json'],
    verbose: true,
};
