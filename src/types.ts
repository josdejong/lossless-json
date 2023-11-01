export type JSONPrimitive = string | number | boolean | null
export type JSONValue =
  | { [key: string]: JSONValue } // object
  | JSONValue[] // array
  | JSONPrimitive
export type JSONObject = { [key: string]: JSONValue }
export type JSONArray = JSONValue[]

/**
 * @deprecated use `unknown` instead
 */
export type JavaScriptPrimitive = unknown

/**
 * @deprecated use `unknown` instead
 */
export type JavaScriptValue = unknown

/**
 * @deprecated use `unknown` instead
 */
export type JavaScriptObject = unknown

/**
 * @deprecated use `unknown` instead
 */
export type JavaScriptArray = unknown

export type Reviver = (key: string, value: JSONValue) => unknown

export type NumberParser = (value: string) => unknown

export type Replacer =
  | ((key: string, value: unknown) => unknown | undefined)
  | Array<string | number>

export interface NumberStringifier {
  test: (value: unknown) => boolean
  stringify: (value: unknown) => string
}

export type GenericObject<T> = Record<string, T>
