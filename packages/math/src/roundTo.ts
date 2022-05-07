/**
 * Rounds a value to a specified number of decimal digits
 *
 * @param value number to round
 * @param precision number od decimal places to round to
 */
export const roundTo = (value: number, precision: number) => {
  if (precision < 0 || Math.round(precision) !== precision) {
    throw new Error('precision must be a positive integer or zero')
  }

  const coefficient = Math.pow(10, precision)

  return Math.round(value * coefficient) / coefficient
}