import type { Config } from '@jest/types';


const config: Config.InitialOptions = {
  verbose: true,
  clearMocks: true,
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  preset: 'ts-jest'
}

export default config
