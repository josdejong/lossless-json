export type JSONPrimitive = string | number | boolean | null
export type JSONValue =
  | { [key: string]: JSONValue } // object
  | JSONValue[] // array
  | JSONPrimitive
export type JSONObject = { [key: string]: JSONValue }
export type JSONArray = JSONValue[]

export type Reviver = (key: string, value: JSONValue) => any

export type NumberParser = (value: string) => any

export type Replacer =
  | ((key: string, value: any) => JSONValue | undefined)
  | Array<string | number>

export interface ValueStringifier {
  test: (value: any) => boolean
  stringify: (value: any) => string
}

export type GenericObject<T> = {
  [key: string]: T
}
