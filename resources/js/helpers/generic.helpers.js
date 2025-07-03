export function dynamicSort(property, direction) {
  const sortOrder = direction === 'asc' ? 1 : -1
  return function (a, b) {
    const result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0
    return result * sortOrder
  }
}

export const capitalize = (s) => (s && s[0].toUpperCase() + s.slice(1)) || ''

export function displayFileSize(size) {
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  let counter = 0,
    n = parseInt(size, 10) || 0
  while (n >= 1024 && ++counter) n = n / 1024
  return n.toFixed(n < 10 && counter > 0 ? 1 : 0) + ' ' + units[counter]
}

export function parseMarkdownJson(markdownText) {
  // Regex to match ```json or ``` followed by JSON content
  const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)```/
  const match = markdownText.match(codeBlockRegex)

  if (match && match[1]) {
    try {
      // Parse the extracted JSON string
      return JSON.parse(match[1].trim())
    } catch (error) {
      throw new Error('Invalid JSON content: ' + error.message)
    }
  } else {
    throw new Error('No code block found in markdown')
  }
}
