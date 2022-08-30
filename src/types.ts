export type JSONPrimitive = string | number | boolean | null
export type JSONValue =
  | { [key: string]: JSONValue } // object
  | JSONValue[] // array
  | JSONPrimitive
export type JSONObject = { [key: string]: JSONValue }
export type JSONArray = JSONValue[]

export type JavaScriptPrimitive = string | number | boolean | null | bigint | Date | unknown
export type JavaScriptValue =
  | { [key: string]: JavaScriptValue } // object
  | JavaScriptValue[] // array
  | JavaScriptPrimitive
export type JavaScriptObject = { [key: string]: JavaScriptValue }
export type JavaScriptArray = JavaScriptValue[]

export type Reviver = (key: string, value: JSONValue) => JavaScriptValue

export type NumberParser = (value: string) => JavaScriptValue

export type Replacer =
  | ((key: string, value: JavaScriptObject) => JSONValue | undefined)
  | Array<string | number>

export interface NumberStringifier {
  test: (value: JavaScriptValue) => boolean
  stringify: (value: JavaScriptValue) => string
}

export type GenericObject<T> = {
  [key: string]: T
}
