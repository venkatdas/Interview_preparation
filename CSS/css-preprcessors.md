## CSS preprocessors


- they are generally interested in your knowledge and experience with tools like Sass (Syntactically Awesome Style Sheets), LESS, or Stylus.
- These preprocessors extend CSS by allowing you to use variables, nested rules, mixins, functions, and more, making your CSS more maintainable and scalable.

**What is CSS preprocessor**

- A CSS preprocessor is a scripting language that extends the default capabilities of CSS.
- It allows developers to write code in one language (like Sass or LESS), which is then compiled into standard CSS that the browser can understand.


**2. Why Use CSS Preprocessors?**
- Variables: They allow the use of variables for consistent values (e.g., colors, font sizes).
- Nesting: Allows writing CSS in a nested syntax, which mirrors the HTML structure, making the code more readable.
M- ixins: Reusable chunks of CSS code that can be included in multiple places throughout the stylesheet.
- Inheritance: Extending styles from one selector to another, avoiding code duplication.
- Functions and Operations: You can use functions for operations like color manipulation, mathematics, and more.

**Popular CSS Preprocessors:**
- Sass (SCSS): The most popular CSS preprocessor. It comes in two syntaxes, SCSS (Sassy CSS) and Sass (indented syntax). SCSS is more similar to CSS and is widely used.
- LESS: Similar to Sass but with a more straightforward syntax. It was one of the first preprocessors and is still used in some legacy projects.
- Stylus: Known for its flexibility and brevity, allowing the omission of semicolons, colons, and braces.


**How Do You Compile Preprocessor Code?**
- Preprocessor code needs to be compiled into regular CSS before it can be used in the browser.
- This is usually done using task runners like Gulp, Grunt, or through build tools like Webpack, which automate the process of compiling your Sass/LESS files.

**Examples for SCSS and LESS**



**SASS (Indented Syntax)**
```js
// Variables
$primary-color: #3498db
$font-stack: Helvetica, sans-serif

// Nesting and Mixins
=border-radius($radius)
  -webkit-border-radius: $radius
     -moz-border-radius: $radius
      -ms-border-radius: $radius
          border-radius: $radius

body
  font: 100% $font-stack
  color: $primary-color

  header
    background: $primary-color
    h1
      font-size: 2em

  .button
    @include border-radius(5px)
    padding: 10px 15px
    background-color: darken($primary-color, 10%)
    &:hover
      background-color: lighten($primary-color, 10%)
```

**SCSS**
```js
// Variables
$primary-color: #3498db;
$font-stack: Helvetica, sans-serif;

// Nesting and Mixins
@mixin border-radius($radius) {
  -webkit-border-radius: $radius;
     -moz-border-radius: $radius;
      -ms-border-radius: $radius;
          border-radius: $radius;
}

body {
  font: 100% $font-stack;
  color: $primary-color;

  header {
    background: $primary-color;
    h1 {
      font-size: 2em;
    }
  }

  .button {
    @include border-radius(5px);
    padding: 10px 15px;
    background-color: darken($primary-color, 10%);
    
    &:hover {
      background-color: lighten($primary-color, 10%);
    }
  }
}

````

**LESS**


- LESS syntax is also similar to regular CSS but with its own set of features like variables, nesting, and mixins. It uses the @ symbol for variables.

```js
// Variables
@primary-color: #3498db;
@font-stack: Helvetica, sans-serif;

// Mixins
.border-radius(@radius) {
  -webkit-border-radius: @radius;
     -moz-border-radius: @radius;
      -ms-border-radius: @radius;
          border-radius: @radius;
}

body {
  font: 100% @font-stack;
  color: @primary-color;

  header {
    background: @primary-color;
    h1 {
      font-size: 2em;
    }
  }

  .button {
    .border-radius(5px);
    padding: 10px 15px;
    background-color: darken(@primary-color, 10%);

    &:hover {
      background-color: lighten(@primary-color, 10%);
    }
  }
}

```


