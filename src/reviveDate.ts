/**
 * Revive a string containing an ISO 8601 date string into a JavaScript `Date` object
 */
export function reviveDate(_key: string, value: unknown): Date | unknown {
  return typeof value === 'string' && isoDateRegex.test(value) ? new Date(value) : value
}

// Matches strings like "2022-08-25T09:39:19.288Z"
const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
