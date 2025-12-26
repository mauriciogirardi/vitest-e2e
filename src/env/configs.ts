import { join } from "node:path"

const commonKeys = {
  drizzleSchemaFiles: [join('src', 'core', 'todo', 'schemas', 'drizzle-todo-table.schema.ts')],
  drizzleMigrationsFolder: join('src', 'db', 'drizzle', 'migrations')
}

const envConfigs = {
  development: {
    databaseFile: 'dev.db.sqlite3',
    currentEnv: 'development',
    ...commonKeys
  },
  production: {
    databaseFile: 'prod.db.sqlite3',
    currentEnv: 'production',
    ...commonKeys
  },
  test: {
    databaseFile: 'int.test.db.sqlite3',
    currentEnv: 'test',
    ...commonKeys
  },
  e2e: {
    databaseFile: 'e2e.test.db.sqlite3',
    currentEnv: 'e2e',
    ...commonKeys
  },
} as const

type TConfigsByEnv = {
  readonly databaseFile: string
  readonly currentEnv: TEnvConfigs
} & typeof commonKeys

type TEnvConfigs = typeof envConfigs
type TAllowedEnvKeys = keyof TEnvConfigs

function isValidEnv(env: string): env is TAllowedEnvKeys {
  return Object.keys(envConfigs).includes(env)
}

export function checkEnv(): TAllowedEnvKeys {
  const currentEnv = process.env.CURRENT_ENV

  if (!currentEnv || !isValidEnv(currentEnv)) {
    throw new Error('Check the .env* and your values in src/env/configs.ts')
  }

  return currentEnv
}

export function getFullEnv() {
  const currentEnv = checkEnv()
  return envConfigs[currentEnv]
}

export function getEnv<C extends keyof TConfigsByEnv>(key: C) {
  const envs = getFullEnv()
  const value = envs[key]
  return value
}