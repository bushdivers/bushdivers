export const personWeight = 170.0

export const displayNumber = (n, decimal = true, pad = false) =>
  decimal
    ? parseFloat(n).toLocaleString(undefined, {
        maximumFractionDigits: 2,
        minimumFractionDigits: pad ? 2 : 0,
      })
    : parseInt(n).toLocaleString()

//export const displayNumber = (n, decimal = true) => decimal ? parseFloat(n).toLocaleString(undefined, { maximumFractionDigits: 2 }) : parseInt(n).toLocaleString()
