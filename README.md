# grunt-mermaid
[![Build Status](https://travis-ci.org/jballe/grunt-mermaid.svg?branch=master)](https://travis-ci.org/jballe/grunt-mermaid)
[![bitHound Overall Score](https://www.bithound.io/github/jballe/grunt-mermaid/badges/score.svg)](https://www.bithound.io/github/jballe/grunt-mermaid)
[![bitHound Dependencies](https://www.bithound.io/github/jballe/grunt-mermaid/badges/dependencies.svg)](https://www.bithound.io/github/jballe/grunt-mermaid/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/jballe/grunt-mermaid/badges/devDependencies.svg)](https://www.bithound.io/github/jballe/grunt-mermaid/master/dependencies/npm)
[![bitHound Code](https://www.bithound.io/github/jballe/grunt-mermaid/badges/code.svg)](https://www.bithound.io/github/jballe/grunt-mermaid)

This is a small grunt plugin that can generate diagram from files with [Mermaid](http://knsv.github.io/mermaid/) syntax.

## Getting started
Install this plugin next to your project's [grunt.js Gruntfile.js](http://gruntjs.com/sample-gruntfile) with: ``npm install grunt-mermaid --save-dev``

Load the plugin in your ``Gruntfile.js`` by adding
```javascript
grunt.loadNpmTasks('grunt-mermaid');
```

Configure this plugin, it is a multi task, a minimal configuration will describe where to find the files by the src attribute.
You can specify destination directory with the dest attribute or omit it, and the generated images will be located next to the original file:
```javascript
grunt.initConfig({
    mermaid: {
        default: {
            src: '*.mmd'
        }
    }
});
```

### Available options
* **bin** where to find the mermaid cli. If not specified we will find the file in the node_modules folder
* **png** (default: true), if true mermaid will be invoked with ``-p`` to generate a .png file
* **svg** (default: false), if true mermaid will be invoked with ``-s`` to generate a .svg file
* **css** (default: null), if specified mermaid will be invoked with ``-t {value}`` so that the css file is used to style the generated graph.
* **width** (default: null), default value for image width. If specified, Mermaid will be invoked with ``-w {value}``. 
See below how this can also be specified in the file
* **phantomjs** Where to find phantomjs used to generate image. Mermaid will be invoked with ``-e {value}``. 
If not specified we will find the path by using the [phantomjs 1.9 package](https://www.npmjs.com/package/phantomjs) as this one is working with mermaid.
* **widthText** (default: '%% width:'). Prefix that can be used to specify width of generated image in file. 
Make the first line with this eg. ``%% width: 500`` and the image will be 500px wide ('%%' indicates a comment in mermaid). 
This can be usefull if you have some diagrams that are simpler/smaller or bigger/more complex than other so the default size will look incorrect.
