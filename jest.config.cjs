/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
     preset: 'ts-jest',
     testEnvironment: 'node',
     transformIgnorePatterns: ['<rootDir>/node_modules/'],
     transform: {
          '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.spec.json' }],
     },
     moduleNameMapper: {
          '^service/(.*)$': '<rootDir>/src/service/$1',
          '^controller/(.*)$': '<rootDir>/src/controller/$1',
          '^model/(.*)$': '<rootDir>/src/model/$1',
          '^util/(.*)$': '<rootDir>/src/util/$1',
          '^constant/(.*)$': '<rootDir>/src/constant/$1',
          '^error/(.*)$': '<rootDir>/src/error/$1',
     },
     moduleFileExtensions: ['ts', 'js'],
     testMatch: ['**/*.spec.ts', '**/*.test.ts'],
};
