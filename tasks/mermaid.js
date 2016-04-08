'use strict';
module.exports = function(grunt) {
    grunt.registerMultiTask('mermaid', function() {

        var phantomjs = require('phantomjs');
        var spawn = require('superspawn').spawn;
        var path = require('path');
        var fs = require('fs');
		
		var LineReader = require('../util/linereader.js');

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
            bin: null,
			widthText: '%% width:'
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

        var fileExists = function(filePath) {
            try {
                return fs.statSync(filePath).isFile();
            } catch (err) {
                if (err && (err + '').indexOf('Error: ENOENT: no such file or directory, stat') === -1) {
                    grunt.verbose.write(err);
                }

                return false;
            }
        };

        options.bin = (function () {
			var msg;
            if (options.bin) {
                if (fileExists(options.bin)) {
                    return options.bin;
                }
                msg = 'Could find phantom at specified path: ' + options.bin;
                grunt.log.error(msg);
                throw msg;
            }

            var checked = [];
            var file = path.resolve(path.join(__dirname, '../node_modules/mermaid/bin/mermaid.js'));
            checked.push(file);
            if (fileExists(file)) {
                return file;
            }

            file = path.resolve('node_modules/mermaid/bin/mermaid.js');
            checked.push(file);
            if (fileExists(file)) {
                return file;
            }

            msg = 'Could not find mermaid.js has been looking in ' + checked.join(' and ');
            grunt.log.error(msg);
            throw msg;
        })();

        grunt.verbose.ok('Found mermaid ' + options.bin);
		
		var getWidthFromFile = function(filePath) {
            try {
                var reader = new LineReader(filePath);
                var firstLine = reader.next().toString();
                reader.close();
                
                var needle = options.widthText;
                if(firstLine && firstLine.lastIndexOf(needle)) {
                    var result = parseInt(firstLine.substring(needle.length + 1).trim(), 0);
                    if(result > 0) {
                        grunt.verbose.writelns('Found width: ' + result + ' for ' + filePath);
                        return result;
                    }
                }
            } catch(err) {
                grunt.error.log('Could not read size from file ' + filePath + ' the error was ' + err);
            }

			return false;
            
		};


        var done = this.async();
        var total, completed;

        var tick = function() {
            if (completed++ === total) {
                done();
            }
        };

        var gaveSuccess = function(path, command, output) {
            grunt.log.ok('Successfully generated diagram for ' + path);
            tick();
        };

        var gaveError = function(path, command, error) {
            grunt.log.error('Could not generate diagram for ' + path + ' when running: ' + command);
            grunt.log.errorlns('due to: ' + error);
            tick();
        };

        grunt.verbose.write('Using phantomjs at ' + options.phantomjs);
		
		var makeMermardCliArgs = function(filePath) {
			var outputPath = fileset.dest || path.dirname(filePath);
			var width = getWidthFromFile(filePath) || options.width;
			
			var args = [filePath, '-o', outputPath];
			if (options.png) { args.push('-p'); }
			if (options.svg) { args.push('-s'); }
			if (width) 		 { args.push('-w'); args.push(width); }
			if (options.css) { args.push('-t'); args.push(options.css); }
			if (options.phantomjs) { args.push('-e'); args.push(options.phantomjs); }

			return args;
		};

        this.files.forEach(function(fileset) {
            grunt.log.writeln('Processing ' + fileset.src.length + ' files.');

            total = fileset.src.length;
            completed = 0;

            fileset.src.forEach(function(filePath) {
				var args = makeMermardCliArgs(filePath);
                var command = [options.bin].concat(args).join(' ');
                grunt.verbose.ok('Running ' + command);

                try {
                    spawn(options.bin, args)
                        .then(function(output) { gaveSuccess(filePath, command, output, arguments); })
                        .catch(function(err) { gaveError(filePath, command, err); })
                        ;
                } catch (err) {
                    console.log(arguments);
                    gaveError(filePath, command, err, arguments);
                }

            });
        });

    });
};