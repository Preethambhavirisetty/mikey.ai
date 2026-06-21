const KEY = 'mikey_address_as'

export function getAddressAs() {
  return localStorage.getItem(KEY) || ''
}

export function setAddressAs(value) {
  const trimmed = (value || '').trim()
  if (trimmed) localStorage.setItem(KEY, trimmed)
  else localStorage.removeItem(KEY)
}
