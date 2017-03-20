const through = require('through2'),
    gutil = require('gulp-util'),
    compiler = require('vueify').compiler,
    path = require('path'),
    fs = require('fs'),
    PluginError = gutil.PluginError,
    PLUGIN_NAME = 'gulp-vueify2';

function gulpVueify(options) {
    let firstPass = true;

    // This function is called each time a new style is extracted from a component
    const onStyle = function({file, style}) {
        const out = options.CSSOut;
        if (typeof out === 'function') {
            out(file, style);
        }
        else if (typeof out === 'string') {
            if (firstPass) {
                /*
                    I'm not 100% comfortable with writing this async cause I'm not sure it couldn't overwrite the next appends
                    However, ad hoc, I never had any trouble with it
                    Since I see no way to detect the end of the stream to write only one time I can't think of another solution for now
                */
                fs.writeFile(out, style + '\n');
                firstPass = false;
            }
            else {
                fs.appendFile(out, style + '\n');
            }
        }
        else {
            this.emit('error', new PluginError(PLUGIN_NAME, 'CSSOut must be a path or a function'));
        }
    };

    return through.obj(function(file, encode, callback) {
        if (file.isNull()) {
            return callback(null, file);
        }
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported'));
            return callback();
        }

        compiler.loadConfig();
        if (options) {
            compiler.applyConfig(options);
            if (options.extractCSS && options.CSSOut) {
                compiler.on('style', onStyle);
            }
        }

        compiler.compile(String(file.contents), file.path, (err, result) => {
            compiler.removeListener('style', onStyle);
            if (err) {
                this.emit('error', new PluginError(PLUGIN_NAME,
                    'In file ' + path.relative(process.cwd(), file.path) + ':\n' + err.message));
                return callback();
            }

            file.path = gutil.replaceExtension(file.path, '.js');
            file.contents = new Buffer(result);
            callback(null, file);
        });
    });
}

module.exports = gulpVueify;
