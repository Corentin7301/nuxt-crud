export function extractModelsFromSchema(schema) {
  const models = []
  const lines = schema.split('\n')
  let isInComment = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (line.includes('/*')) isInComment = true
    if (line.includes('*/')) {
      isInComment = false
      continue
    }
    if (isInComment) continue

    if (line.startsWith('//')) continue

    const modelMatch = line.match(/^model\s+(\w+)\s*\{/)
    if (modelMatch) {
      models.push(modelMatch[1])
    }
  }

  return models
}
