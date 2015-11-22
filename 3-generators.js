/**
 * Generators
 *
 * @Reference:
 * http://www.2ality.com/2015/03/es6-generators.html
 */

/**
 * What are generators?
 */

//  Two things distinguish genFunc from a normal function declaration:
//    It starts with the “keyword” function*.
//    It is paused in the middle via yield.
function* genFunc() {
  console.log('First');
  yield;                  // (A)
  console.log('Second');  // (B)
}
//  Calling genFunc does not execute it. Instead, it returns a so-called generator object that lets us control genFunc’s execution:
let genObj = genFunc();

// genFunc() is initially suspended at the beginning of its body. The method genObj.next() continues the execution of genFunc, until the next yield:
genObj.next();
// OUTPUT:
// First
// { value: undefined, done: false }

// genFunc is now paused in line (A). If we call next() again, execution resumes and line (B) is executed
genObj.next();
// OUTPUT:
// Second
// { value: undefined, done: true }


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



// 1. Generators as iterators (data production)
/**
 * Recursion via yield*
 */
function* foo() {
  yield 'a';
  yield 'b';
}

function* bar() {
  yield 'x';
  yield* foo(); // yield* is used for making recursive generator calls.
  yield 'y';
}

// Collect all values yielded by bar() in an array
let arr = [...bar()];
// ['x', 'a', 'b', 'y']


/**
 * Iterating over trees
 */
// Consider the following data structure for binary trees.
// It is iterable, because it has a method whose key is Symbol.iterator.
// That method is a generator method and returns an iterator when called.
class BinaryTree {
  constructor(value, left=null, right=null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }

  // Prefix iteration
  *[Symbol.iterator]() {
    yield this.value;
    if (this.left) {
      yield* this.left;
    }
    if (this.right) {
      yield* this.right;
    }
  }
}

// The following code creates a binary tree and iterates over it via for-of:
let tree = new BinaryTree('a',
  new BinaryTree('b',
    new BinaryTree('c'),
    new BinaryTree('d')),
  new BinaryTree('e'));

for (let x of tree) {
  console.log(x);
}
// Output:
// a
// b
// c
// d
// e


/**
 * You can only yield in generators -- yielding in callbacks doesn’t work
 */
function* genFunc() {
  ['a', 'b'].forEach(x => yield x); // SyntaxError
}

// Refactored
function* genFunc() {
  for (let x of ['a', 'b']) {
    yield x; // OK
  }
}



// 2. Generators as observers (data consumption)

/**
 * Sending values via next()
 */
// If you use a generator as an observer, you send values to it via next() and it receives those values via yield:
function* dataConsumer() {
  console.log('Started');
  console.log(`1. ${yield}`); // (A)
  console.log(`2. ${yield}`);
  return 'result';
}

// Let’s use this generator interactively. First, we create a generator object:
let genObj = dataConsumer();

// We now call genObj.next(), which starts the generator. Execution continues until the first yield, which is where the generator pauses.
// The result of next() is the value yielded in line (A) (undefined, because yield doesn’t have an operand).
genObj.next();
// OUTPUT:
// Started
// { value: undefined, done: false }

// We call next() two more times, in order to send the value 'a' to the first yield and the value 'b' to the second yield:
genObj.next('a');
// 1. a
// { value: undefined, done: false }

genObj.next('b');
// 2. b
// { value: 'result', done: true }

// The result of the last next() is the value returned from dataConsumer(). done being true indicates that the generator is finished.
// Unfortunately, next() is asymmetric, but that can’t be helped: It always sends a value to the currently suspended yield, but returns the operand of the following yield.


/**
 * The first next()
 *
 * When using a generator as an observer, it is important to note that the only purpose of the first invocation of next() is to start the observer.
 * It is only ready for input afterwards, because this first invocation has advanced execution to the first yield.
 * Therefore, you can’t send input via the first next() – you even get an error if you do
 */
function* g() { yield }
g().next('hello');
// TypeError: attempt to send 'hello' to newborn generator


/**
 * yield binds loosely
 */
yield a + b + c;

// Is treated as
yield (a + b + c);

// Not as
(yield a) + b + c;

