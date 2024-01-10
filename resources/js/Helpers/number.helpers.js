export const personWeight = 170.0

export const displayNumber = (n, decimal = true) =>
  decimal
    ? parseFloat(n).toLocaleString(undefined, { maximumFractionDigits: 2 })
    : parseInt(n).toLocaleString()

//export const displayNumber = (n, decimal = true) => decimal ? parseFloat(n).toLocaleString(undefined, { maximumFractionDigits: 2 }) : parseInt(n).toLocaleString()
