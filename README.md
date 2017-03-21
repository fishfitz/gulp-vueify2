# gulp-vueify2
Compile `*.vue` component files using vueify **without** Browserify. Can be usefull for Electron app and server-side rendering (I wrote it primarily for the second case).

Use code from the package [gulp-vueify](https://github.com/Zahajki/gulp-vueify), written by Zahajki, which seems abandoned. Main differences with the mentionned package are support for Vue2 and out of the box CSS extraction.

## Installation
```bash
npm install gulp-vueify2 --save-dev
```

If you want to keep the CSS inline (won't work for server-side rendering), you also may have to do:
```bash
npm install vueify-insert-css babel-core babel-plugin-transform-runtime babel-preset-es2015 --save-dev
```

## Usage
```javascript
var vueify = require('gulp-vueify2');

gulp.task('vueify', function () {
  return gulp.src('components/**/*.vue')
    .pipe(vueify(options))
    .pipe(gulp.dest('./dist'));
});
```

Options for vueify are listed [there](https://github.com/vuejs/vueify/#configuring-options).

I added one, `CSSOut` to specify the output of the style content, if extractCSS is set to true (ignored otherwise). Value can be a string (path to an output file), or a function that will be called for each component with the path of the component and the corresponding style.

### With an output file
```javascript
gulp.task('vueify', function () {
  return gulp.src('components/**/*.vue')
    .pipe(vueify({
        extractCSS: true,
        CSSOut: "./foo/bundle.css"
    }))
    .pipe(gulp.dest('./dist'));
});
```

### With a function
```javascript
gulp.task('vueify', function () {
  return gulp.src('components/**/*.vue')
    .pipe(vueify({
        extractCSS: true,
        CSSOut: function(file, style) {
            // file = full path of the .vue component file
            // style = a css string
        }
    }))
    .pipe(gulp.dest('./dist'));
});
```
