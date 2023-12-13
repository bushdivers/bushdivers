export const personWeight = 170.00

export const displayNumber = (n, decimal = true) => decimal ? parseFloat(n).toLocaleString(undefined, { maximumFractionDigits: 2 }) : parseInt(n).toLocaleString()
