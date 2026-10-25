import { expect, test } from 'vitest'
import { parse } from './parse'

type Holder = Record<string, unknown>
type Mutation = (holder: Holder) => void

function runReviver(text: string, mutation: Mutation, native: boolean) {
  const calls: Array<{ key: string; value: unknown }> = []
  const reviver = function (this: Holder, key: string, value: unknown) {
    calls.push({ key, value: value && typeof value === 'object' ? Object.keys(value) : value })
    if (key === '0' || key === 'a') {
      mutation(this)
    }
    return key === '1' || key === 'b' ? 20 : value
  }
  const result = (native ? JSON.parse(text, reviver) : parse(text, reviver, Number)) as Holder
  const descriptors = Object.fromEntries(
    Object.getOwnPropertyNames(result).map((key) => {
      const descriptor = Object.getOwnPropertyDescriptor(result, key)!
      return [
        key,
        {
          configurable: descriptor.configurable,
          enumerable: descriptor.enumerable,
          writable: descriptor.writable,
          value: descriptor.value,
          get: typeof descriptor.get,
          set: typeof descriptor.set
        }
      ]
    })
  )
  return { calls, descriptors }
}

const arrayMutations: Array<[string, Mutation]> = [
  ['append', (holder: Holder) => (holder[3] = 4)],
  ['shrink', (holder: Holder) => (holder.length = 1)],
  [
    'shrink and lock the length',
    (holder: Holder) => Object.defineProperty(holder, 'length', { value: 1, writable: false })
  ],
  ['remove a later index', (holder: Holder) => delete holder[1]],
  ['replace a later value', (holder: Holder) => (holder[2] = { child: true })]
]

test.each(arrayMutations)(
  'reviver keeps the original array traversal range: %s',
  (_name, mutation) => {
    const expected = runReviver('[1,2,3]', mutation, true)
    expect(runReviver('[1,2,3]', mutation, false)).toEqual(expected)
  }
)

test('reviver captures the traversal range separately for nested arrays', () => {
  const mutation = (holder: Holder) => (holder[3] = 4)
  const expected = runReviver('[[1,2],[3]]', mutation, true)
  expect(runReviver('[[1,2],[3]]', mutation, false)).toEqual(expected)
})

test.each([2.9, '2.9', null, undefined, -1, Number.NaN])(
  'reviver converts an introduced array proxy length to a traversal range: %s',
  (length) => {
    const mutation = (holder: Holder) => {
      holder.b = new Proxy([1, 2, 3], {
        get(target, key, receiver) {
          return key === 'length' ? length : Reflect.get(target, key, receiver)
        }
      })
    }
    const expected = runReviver('{"a":1,"b":2}', mutation, true)
    expect(runReviver('{"a":1,"b":2}', mutation, false)).toEqual(expected)
  }
)

test('reviver reads and coerces an introduced array proxy length only once', () => {
  function run(native: boolean) {
    const events: string[] = []
    const mutation = (holder: Holder) => {
      holder.b = new Proxy([1, 2, 3], {
        get(target, key, receiver) {
          if (key === 'length') {
            events.push('get length')
            return {
              valueOf() {
                events.push('coerce length')
                return events.length === 2 ? 1 : 2
              }
            }
          }
          return Reflect.get(target, key, receiver)
        }
      })
    }
    return { ...runReviver('{"a":1,"b":2}', mutation, native), events }
  }
  expect(run(false)).toEqual(run(true))
})

test('reviver rejects an introduced array proxy length that cannot convert to a number', () => {
  const mutation = (holder: Holder) => {
    holder.b = new Proxy([1, 2, 3], {
      get(target, key, receiver) {
        return key === 'length' ? 2n : Reflect.get(target, key, receiver)
      }
    })
  }
  expect(() => runReviver('{"a":1,"b":2}', mutation, true)).toThrow(TypeError)
  expect(() => runReviver('{"a":1,"b":2}', mutation, false)).toThrow(TypeError)
})

const descriptors: Array<[string, PropertyDescriptor]> = [
  ['configurable read-only value', { configurable: true, value: 7, writable: false }],
  ['non-configurable read-only value', { configurable: false, value: 7, writable: false }],
  ['non-configurable writable value', { configurable: false, value: 7, writable: true }],
  [
    'configurable accessor',
    {
      configurable: true,
      get() {
        return 7
      },
      set() {
        throw new Error('the reviver must not assign through an accessor')
      }
    }
  ]
]

test.each(descriptors)(
  'reviver replaces object properties with data properties: %s',
  (_name, descriptor) => {
    const mutation = (holder: Holder) => Object.defineProperty(holder, 'b', descriptor)
    const expected = runReviver('{"a":1,"b":2}', mutation, true)
    expect(runReviver('{"a":1,"b":2}', mutation, false)).toEqual(expected)
  }
)

test.each(descriptors)(
  'reviver replaces array elements with data properties: %s',
  (_name, descriptor) => {
    const mutation = (holder: Holder) => Object.defineProperty(holder, '1', descriptor)
    const expected = runReviver('[1,2,3]', mutation, true)
    expect(runReviver('[1,2,3]', mutation, false)).toEqual(expected)
  }
)

test.each(['{"a":1,"b":2}', '[1,2,3]'])(
  'reviver continues after refused property writes: %s',
  (text) => {
    const expected = runReviver(text, Object.freeze, true)
    expect(runReviver(text, Object.freeze, false)).toEqual(expected)
  }
)

test.each(['{"a":1,"b":2}', '[1,2,3]'])(
  'reviver continues when a removed property cannot be recreated: %s',
  (text) => {
    const mutation = (holder: Holder) => {
      delete holder[Array.isArray(holder) ? '1' : 'b']
      Object.preventExtensions(holder)
    }
    const expected = runReviver(text, mutation, true)
    expect(runReviver(text, mutation, false)).toEqual(expected)
  }
)

test.each(['{"a":1,"b":2}', '[1,2,3]'])('reviver ignores a refused deletion: %s', (text) => {
  function run(native: boolean) {
    const calls: string[] = []
    const reviver = function (this: Holder, key: string, value: unknown) {
      calls.push(key)
      if (key === 'a' || key === '0') {
        Object.defineProperty(this, key === 'a' ? 'b' : '1', { configurable: false })
      }
      return key === 'b' || key === '1' ? undefined : value
    }
    const result = native ? JSON.parse(text, reviver) : parse(text, reviver, Number)
    return { result, calls }
  }
  expect(run(false)).toEqual(run(true))
})

test('reviver still propagates callback failures', () => {
  const error = new Error('reviver failed')
  expect(() =>
    parse('[1,2,3]', () => {
      throw error
    })
  ).toThrow(error)
})

test('reviver ignores false from a proxy property operation', () => {
  const mutation = (holder: Holder) => {
    holder.b = new Proxy(
      { child: true },
      {
        defineProperty() {
          return false
        }
      }
    )
  }
  const expected = runReviver('{"a":1,"b":2}', mutation, true)
  expect(runReviver('{"a":1,"b":2}', mutation, false)).toEqual(expected)
})

test('reviver still propagates an exception from a proxy property operation', () => {
  const error = new Error('property update failed')
  const mutation = (holder: Holder) => {
    holder.b = new Proxy(
      { child: true },
      {
        defineProperty() {
          throw error
        }
      }
    )
  }
  expect(() => runReviver('{"a":1,"b":2}', mutation, true)).toThrow(error)
  expect(() => runReviver('{"a":1,"b":2}', mutation, false)).toThrow(error)
})
