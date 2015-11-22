/**
 * Generators
 *
 * @Reference:
 * http://www.2ality.com/2015/03/es6-generators.html
 */

/**
 * Implementing iterables via generators
 */
// The asterisk after `function` means that`objectEntries` is a generator
function* objectEntries(obj) {
  // Reflect is a built-in object that provides methods for interceptable JavaScript operations.
  // Reflect.ownKeys returns an array of the target object's own (not inherited) property keys.
  // https://twitter.com/nilssolanki/status/659839340592422912
  let propKeys = Reflect.ownKeys(obj);

  for (let propKey of propKeys) {
    // `yield` returns a value and then pauses the generator. Later, the execution continues where it was previously paused.
    yield[propKey, obj[propKey]];
  }

}
// Usage
let jane = {first: 'Jane', last: 'Doe'};
for (let [key, value] of objectEntries(jane)) {
  console.log(`${key}: ${value}`);
}
// Output:
// first: Jane
// last: Doe

/**
 * Blocking on asynchronous function calls
 */
// In the following code, I use the control flow library co to asynchronously retrieve two JSON files.
// Note how, in line (A), execution blocks (waits) until the result of Promise.all() is ready.
// That means that the code looks synchronous while performing asynchronous operations.

co(function* () {
  try {
    let [croftStr, bondStr] = yield Promise.all([ // A
      getFile('http://localhost:8000/croft.json'),
      getFile('http://localhost:8000/bond.json')
    ]);
    let croftJson = JSON.parse(croftStr);
    let bondJson = JSON.parse(bondStr);

    console.log(croftJson);
    console.log(bondJson);
  } catch (e) {
    console.log('Failure to read: ' + e);
  }
});