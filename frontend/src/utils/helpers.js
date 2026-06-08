export const parseOptions = (optionsStr) => {
  if (!optionsStr) return []
  return optionsStr.split(',').map(o => o.trim()).filter(o => o)
}

export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('ro-RO')
}
