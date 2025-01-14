# Knockout ESNext [![Build Status](https://travis-ci.com/justlep/knockout-esnext.svg?branch=master)](https://app.travis-ci.com/github/justlep/knockout-esnext) 

A complete overhaul of the [Knockout.js](https://knockoutjs.com/) library and build process.

Making *Knockout.js* slicker, faster, more maintainable than ever.


### Changes (in code):
* Rewrote all library code in ES6+ supported in all modern browsers
* Use native means for iterations, mappings etc. instead of former helper functions (like ko.utils.arrayForEach)
* Reduced indirections by inlining function bodies via Rollup inline-macros plugin
* Turned former *source fragments* into ES modules 
  * Retained most of the original names & structure, so catchup & diffing with original Knockout.js remains possible
  * Easy circular-dependency detection through ESM imports/exports
  * No more worries about loading order of fragments, no more file concatenation at all
* Internals are now self-contained & **namespace-agnostic**
  * no more `ko.foo.bar` references or assignments internally
  * `ko.js` being the **only source of truth** about what is exposed publicly (including legacy aliases)
  * override-points like `ko.onError` are setters in `ko.js`, so we gain full control over what can be overridden
* Removed historic browser support (IE, earliest Firefox etc)
* Removed jQuery support
* Kept all ~1300 tests working with very few changes:
  * Added tests for type checking (`ko.isObservable` etc) in `basicTypeCheckBehaviors.js`
  * Removed IE/jQuery-related tests

### Changes (in behavior)
* When using `extend({notify: 'always'})` with observables/computeds, their current default *OR* custom `equalityComparer` is 
  now memorized and can be restored by using the extender again with anything other than `'always'`. 
  Original Knockout would only reassign its default equality comparer (`valuesArePrimitiveAndEqual`).

### Changes (build process):
* Removed Google Closure Compiler and all code soothing its side-effects (`ko.exportSymbol`)
* Using [Rollup](https://rollupjs.org/guide/en/) + [Terser](https://github.com/terser/terser) plugin for build & minification
* Wrote Rollup plugin `rollup-plugin-inline-macros.js`, allowing to "inline" frequently used helper functions & avoid function calls in hot code paths
* Now exporting the Knockout.js library in 3 flavors:
    * Minified UMD (`knockout.js`)
    * Minified ES Module (`knockout.esm.js`)
    * Non-minified UMD **debug version incl. sourcemap** (`knockout-debug.js`, `knockout-debug.js.map`)
* Removed deprecated `PhantomJS`
* Added [`ESLint`](https://eslint.org/) for code quality checks 

### Changes (testing/debugging)
* After changing any source file during browser testing (`spec/runner.html`), 
  you now have to run the `rollup-dev` task before the next test-run:    
    * ```shell script
      npm run rollup-dev
      ```
  This will rebuild the `build/output/knockout-latest.debug.js` used by `runner.html`.    
* The debug version now has a sourcemap generated alongside it (`knockout-latest.debug.js.map`), 
  so you can attach your IDE's debugger to e.g. `runner.html` and add breakpoints
  inside the actual source files rather than the generated `knockout-latest.debug.js`.  
  


  
---
   
    

# Knockout

**Knockout** is a JavaScript [MVVM](http://en.wikipedia.org/wiki/Model_View_ViewModel) (a modern variant of MVC) library that makes it easier to create rich, desktop-like user interfaces with JavaScript and HTML. It uses *observers* to make your UI automatically stay in sync with an underlying data model, along with a powerful and extensible set of *declarative bindings* to enable productive development.

## Getting started

[![Join the chat at https://gitter.im/knockout/knockout](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/knockout/knockout?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

**Totally new to Knockout?** The most fun place to start is the [online interactive tutorials](http://learn.knockoutjs.com/).

For more details, see

 * Documentation on [the project's website](http://knockoutjs.com/documentation/introduction.html)
 * Online examples at [http://knockoutjs.com/examples/](http://knockoutjs.com/examples/)

## Downloading Knockout

You can [download released versions of Knockout](http://knockoutjs.com/downloads/) from the project's website.

For Node.js developers, Knockout is also available from [npm](https://npmjs.org/) - just run `npm install knockout`.

## Building Knockout from sources

If you prefer to build the library yourself:

1. **Clone the repo from GitHub**

   ```sh
   git clone https://github.com/knockout/knockout.git
   cd knockout
   ```

2. **Acquire build dependencies.**

   Make sure you have [Node.js](http://nodejs.org/) installed on your workstation. This is only needed to _build_ Knockout from sources. Knockout itself has no dependency on Node.js once it is built (it works with any server technology or none). Now run:

   ```sh
   npm install -g grunt-cli
   npm install
   ```

   The first `npm` command sets up the popular [Grunt](http://gruntjs.com/) build tool. You might need to run this command with `sudo` if you're on Linux or Mac OS X, or in an Administrator command prompt on Windows. The second `npm` command fetches the remaining build dependencies.

3. **Run the build tool**

   ```sh
   grunt
   ```
   Now you'll find the built files in `build/output/`.

## Running the tests

If you have [phantomjs](http://phantomjs.org/download.html) installed, then the `grunt` script will automatically run the specification suite and report its results.

Or, if you want to run the specs in a browser (e.g., for debugging), simply open `spec/runner.html` in your browser.

## License

MIT license - [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php)
