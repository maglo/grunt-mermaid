'use strict';

module.exports = function(grunt) {

    var path = require('path');

    grunt.initConfig({

        mermaid: {
            default: {
                src: './*.mmd',
            },
            other: {
                src: '*.mmd',
                dest: 'output'
            }
        }
    });

    grunt.loadNpmTasks('grunt-mermaid');
};