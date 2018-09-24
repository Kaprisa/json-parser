import json from './test.json'
import R from 'ramda'
const str = JSON.stringify(json)

class Parser {
  constructor() {
    this.result = {}
    this.path = []
    this.mode = 'object'
  }

  parse(str) {
    const matches = str.match(/[{}\[\]]|"[^"]*":?|\d+/ig)
    this.process(matches)
  }

  set(v) {
    this.result = R.assocPath(this.path, v, this.result)
  }

  process(matches) {
    while (matches.length) {
      const m = matches.shift()
      if (m.endsWith(':')) {
        const prop = m.replace(/[":]/ig, '')
        const v = matches.shift()
        this.path.push(prop)
        if (v === '{') {
          this.mode = 'object'
          this.set({})
        } else if (v === '[') {
          this.mode = 'array'
          this.set([])
          this.path.push(-1)
        } else {
          this.set(v.replace(/"/g, ''))
          this.path.pop()
        }
      } else if (m === ']') {
        this.path.pop()
        this.path.pop()
        this.mode = 'object'
      } else if (this.mode === 'array') { // array
        const idx = this.path.pop()
        this.path.push(idx + 1)
        if (m === '{') {
          this.set({})
        } else {
          this.set(m.replace(/"/g, ''))
        }
      }
      if (m === '}') {
        this.path.pop()
      }
    }
  }
}
const time = Date.now()
const parser = new Parser()
parser.parse(str)
console.log(parser.result)
console.log(Date.now() - time)


