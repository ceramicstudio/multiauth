export interface Deferred<T> extends Promise<T> {
  resolve: (value?: T | PromiseLike<T>) => void
  reject: (reason?: any) => void
}

export function deferred<T>(): Deferred<T> {
  let methods
  const promise = new Promise<T>((resolve, reject): void => {
    methods = { resolve, reject }
  })
  return Object.assign(promise, methods) as Deferred<T>
}

export function getEnvString(key: string): string | null {
  const value = process.env[key]
  return typeof value === 'string' && value !== '' ? value : null
}

export function getEnvStringArray(key: string, separator = ','): Array<string> | null {
  const value = getEnvString(key)
  return value ? value.split(separator) : null
}

export function getEnvInt(key: string, radix = 10): number | null {
  const value = getEnvString(key)
  return value ? parseInt(value, radix) : null
}

export function getEnvIntArray(key: string, separator = ',', radix = 10): Array<number> | null {
  const values = getEnvStringArray(key, separator)
  return values ? values.map((v) => parseInt(v, radix)) : null
}
