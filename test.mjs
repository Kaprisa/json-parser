import R from 'ramda'

const braces = {
  '{': '}',
  '[': ']',
}

const quote = '"'

const safeExec = (str, re) => re.exec(str)[1]

class Parser {
  constructor() {
    this.result = {}
    this.str = ''
    this.counter = 0
    this.path = []
    this.type = null
  }
  inc() {
    this.counter ++
  }
  currentSymbol() {
    return this.str[this.counter]
  }
  invalidate() {
    this.counter = 0;
    this.str = '';
  }
  shift(count) {
    this.str = this.str.substring(count ? count + 1 : this.counter + 1)
    this.counter = 0
    // this.str = this.str.substring(this.counter + 1)
    // console.log(this.str)
    // this.counter = 0
  }
  add(data) {
    this.str += data;
  }
  parse() {
    this.process()
  }
  process() {
    this.addObject()
  }
  addProp() {
    const prop = safeExec(this.str, /"([^"]*)":/i)
    this.shift(3 + prop.length)
    this.path.push(prop)
  }
  addString() {
    const value = safeExec(this.str, /"([^"]*)"/i)
    this.shift(2 + value.length)
    this.addValue(value)
  }
  addObject() {
    while (this.currentSymbol() !== braces['{']) {
      this.addProperty()
      this.path.pop()
    }
    this.shift(1)
  }
  addProperty() {
    this.addProp()
    console.log(this.str)
    switch (this.currentSymbol()) {
      case quote:
        this.addString()
        break
      case '{':
        this.addObject()
        break
      case '[': {
        this.addArray()
        break
      }
    }
  }
  addArray() {

  }
  addValue(value) {
    this.result = R.set(R.lensPath(this.path), value, this.result)
  }
}

const parser = new Parser()
parser.add(JSON.stringify({hello: 'world', object: {
  nestedObject: {
    hello: "world"
  }
  }}))
parser.parse()
console.log(parser.result)
