'use strict';
module.exports = function(grunt) {
    grunt.registerMultiTask('mermaid', function() {

        var phantomjs = require('phantomjs');
        var spawn = require('superspawn').spawn;
        var path = require('path');

        var options = this.options({
            extension: '.mmd',
            src: null,
            dest: null,
            cwd: null,
            png: true,
            svg: false,
            phantomjs: phantomjs.path,
            css: null,
            verbose: false,
            bin: path.resolve(path.join(__dirname, '../node_modules/mermaid/bin/mermaid.js'))
        });

        var validateSrcAndDest = function() {

            if (!grunt.file.isDir(options.src)) {
                grunt.fail.fatal('invalid src directory');
            } else {
                grunt.verbose.ok('valid src directory');
            }

            if (!options.dest) {
                options.dest = options.src;
            }
        };

        var done = this.async();
        var total, completed;

        var tick = function() {
            if (completed++ === total) {
                done();
            }
        };

        var gaveSuccess = function(path, command, output) {
            grunt.log.ok('Successfully generated diagram for' + path);
            tick();
        };

        var gaveError = function(path, command, error) {
            console.log(arguments);
            // This error is not printed!?
            grunt.log.errorlns('Could not generating diagram for ' + path + ' when running: ' + command + '\nDue to: ' + error);
            tick();
        };

        this.files.forEach(function(fileset) {
            grunt.log.writeln('Processing ' + fileset.src.length + ' files.');

            total = fileset.src.length;
            completed = 0;

            fileset.src.forEach(function(filePath) {
                var outputPath = fileset.dest || path.dirname(filePath);
                
                var args = [filePath, '-o', outputPath];
                if (options.png) { args.push('-p'); }
                if (options.svg) { args.push('-s'); }
                if (options.width) { args.push('-w'); args.push(options.width); }
                if (options.css) { args.push('-t'); args.push(options.css); }
                if (options.phantomjs) { args.push('-e'); args.push(options.phantomjs); }

                var command = [options.bin].concat(args).join(' ');
                grunt.verbose.ok('Running ' + command);

                try {
                    spawn(options.bin, args)
                        .catch(function(err) { gaveError(filePath, command, err); })
                        .then(function(output) { gaveSuccess(filePath, command, output); });
                } catch (err) {
                    console.log(arguments);
                    gaveError(filePath, command, err);
                }

            });
        });

    });
};