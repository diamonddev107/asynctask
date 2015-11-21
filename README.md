# Asynchronous JavaScript
Evolution of Async handling in JavaScript!

## Callbacks
In JavaScript, functions are first-class objects; that is, functions are of the type Object and they can be used in a first-class manner like any other object (String, Array, Number, etc.) since they are in fact objects themselves. They can be “stored in variables, passed as arguments to functions, created within functions, and returned from functions”.

Because functions are first-class objects, we can pass a function as an argument in another function and later execute that passed-in function or even return it to be executed later. This is the essence of using callback functions in JavaScript. 

A callback function, also known as a higher-order function, is a function that is passed to another function (let’s call this other function “otherFunction”) as a parameter, and the callback function is called (or executed) inside the otherFunction.

### How Callback Functions Work?
We can pass functions around like variables and return them in functions and use them in other functions. When we pass a callback function as an argument to another function, we are only passing the function definition. We are not executing the function in the parameter. In other words, we aren’t passing the function with the trailing pair of executing parenthesis () like we do when we are executing a function.

And since the containing function has the callback function in its parameter as a function definition, it can execute the callback anytime. Note that the callback function is not executed immediately. It is “called back” (hence the name) at some specified point inside the containing function’s body.

When we pass a callback function as an argument to another function, the callback is executed at some point inside the containing function’s body just as if the callback were defined in the containing function. This means the callback is a closure. As we know, closures have access to the containing function’s scope, so the callback function can access the containing functions’ variables, and even the variables from the global scope.

### Basic Principles when Implementing Callback Functions
* Use Named OR Anonymous Functions as Callbacks
* Can pass Parameters to Callback Functions
  * Since the callback function is just a normal function when it is executed, we can pass parameters to it. We can pass any of the containing function’s properties (or global properties) as parameters to the callback function.
* Make Sure Callback is a Function Before Executing It
  * It is always wise to check that the callback function passed in the parameter is indeed a function before calling it. Also, it is good practice to make the callback function optional.
* Use the Call or Apply Function To Preserve `this`
  * When the callback function is a method that uses the this object, we have to modify how we execute the callback function to preserve the this object context. Or else the this object will either point to the global window object (in the browser), if callback was passed to a global function. Or it will point to the object of the containing method.
  * We can fix the preceding problem by using the Call or Apply function. Call and Apply are used to set the this object inside the function and to pass arguments to the functions.
* Multiple Callback Functions Allowed
  * We can pass more than one callback functions into the parameter of a function, just like we can pass more than one variable.
  
### “Callback Hell” Problem And Solution
In asynchronous code execution, which is simply execution of code in any order, sometimes it is common to have numerous levels of callback functions to the extent that it is messy and hard to comprehend.
 
Here are two solutions to this problem:
 * Name your functions and declare them and pass just the name of the function as the callback, instead of defining an anonymous function in the parameter of the main function.
 * Modularity: Separate your code into modules, so you can export a section of code that does a particular job. Then you can import that module into your larger application.
     
## Callback functions - Benefits
* Do not repeat code (DRY—Do Not Repeat Yourself)
* Implement better abstraction where you can have more generic functions that are versatile (can handle all sorts of functionalities)
* Have better maintainability
* Have more readable code
* Have more specialized functions.  

## Callback functions - Use cases
* For asynchronous execution (such as reading files, and making HTTP requests)
* In Event Listeners/Handlers
* In setTimeout and setInterval methods
* For Generalization: code conciseness
  