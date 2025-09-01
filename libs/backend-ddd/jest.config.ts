/* eslint-disable */
import type { Config } from 'jest'

const config: Config = {
  displayName: '@tee/backend-ddd',
  preset: '../../jest.preset.cjs',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }]
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/libs/backend-ddd',
  roots: ['./tests']
}

export default config;
