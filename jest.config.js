module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testMatch: ['<rootDir>/src/**/*.spec.ts'],

    transform: {
        // Update the <transform_regex> to match the file extensions you want to transform
        '^.+\\.tsx?$': ['ts-jest', { /* ts-jest config goes here in Jest */ }],
    },
};
