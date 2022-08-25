export type JSONPrimitive = string | number | boolean | null
export type JSONValue =
  | { [key: string]: JSONValue } // object
  | JSONValue[] // array
  | JSONPrimitive
export type JSONObject = { [key: string]: JSONValue }
export type JSONArray = JSONValue[]

export type Reviver = (key: string, value: JSONValue) => unknown

export type NumberParser = (value: string) => unknown

export type Replacer =
  | ((key: string, value: unknown) => JSONValue | undefined)
  | Array<string | number>

export interface ValueStringifier {
  test: (value: unknown) => boolean
  stringify: (value: unknown) => string
}

export type GenericObject<T> = {
  [key: string]: T
}
