const tokens = {
  'string': {
    check: (value) => typeof value === 'string',
    text: 'a string',
  },
  'number': {
    check: (value) => typeof value === 'number',
    text: 'a number',
  },
  'array': {
    check: (value) => Array.isArray(value),
    text: 'an array',
  },
  'defined': {
    check: (value) => value != null,
    text: 'defined',
  }
}

export class Validator {
  static isString(value) {
    return typeof value === 'string'
  }

  static isNumber(value) {
    return typeof value === 'number'
  }

  static isArray(value) {
    return Array.isArray(value)
  }

  constructor(topic) {
    this.topic = topic
  }

  validateAttr(path, value, type) {
    const token = tokens[type]
    if (!token.check(value)) {
      throw new Error(`${this.topic}: Attribute ${path} must be a ${token.text}.`)
    }
  }
}
