/* eslint-disable */
import type { Config } from 'jest'

const config: Config = {
  displayName: '@tee/data',
  preset: '../../jest.preset.ts',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: './tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/libs/data',
  roots: ['./tests']
};

export default config;
