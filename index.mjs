import json from './test.json'

const str = JSON.stringify(json)

const braces = {
  '{': '}',
  '[': ']'
}

const buildObject = (s, t) => {
    let result = {}
    const len = s.length
    let readingProp = false
    let last = ''
    let prop = ''
    while (t < len) {
      // start building object and after that move t to the end of the object
      if (s[t] === '{') {
        readingProp = !readingProp;
        [result[last], t] = buildObject(s, t + 1);
      }
      // array
      if (s[t] === '[') {
        readingProp = !readingProp;
        let arrayValue = []
        while (s[t] !== braces['[']) {
          t++
          if (s[t] === '{') {
            let r;
            [r, t] = buildObject(s, t + 1)
            arrayValue.push(r)
          }
          if (s[t] === "\"") {
            t++
            while (s[t] !== "\"") {
              prop += s[t]
              t++
            }
            t++
            arrayValue.push(prop)
            prop = ''
          }
        }
        result[last] = arrayValue
      }
      // end building object, return object and ending index
      if (s[t] === '}') {
        return [result, t + 1]
      }
      // start word
      if (s[t] === "\"") {
        readingProp = !readingProp
        while (true) {
          t++
          // end word
          if (s[t] === "\"") {
            // object property name
            if (readingProp) {
              result[prop] = null
              last = prop
            } else {
              // last property equals value
              result[last] = prop
            }
            prop = ''
            break
          }
          prop += s[t]
        }
      }
      t++
    }
}

const parse = () => {
  const time = Date.now()
  buildObject(str, 1)
  console.log("My time: ", Date.now() - time)
  const time2 = Date.now()
  JSON.parse(str)
  console.log("time: ", Date.now() - time2)
}

parse()
