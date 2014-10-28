connect-template
=============

A node connect middleware component to support grunt template.

For example, the following in an html file:

```html
<%= connect.template %>
```

will be replaced with the properties defined in grunt config file in template section.


Installation
------------
To install, do the following

```
npm install connect-template --save
```

Then include as a middleware component to connect:

```javascript
var fs = require('fs');
var template = require('connect-template');

var propertiesFile = JSON.parse(fs.readFileSync('./path/to/file.json', 'utf8'));

connect().use(template(propertiesFile));
```

Gruntfile.js
------------
If you're using Grunt, include as follows in `Gruntfile.js`:

```javascript

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // require connect-template
    var gruntTemplate = require("connect-template");

    grunt.initConfig({
        // ...
        template: {
            // Note: this is also compatible with grunt-template
            options: {
                data: grunt.file.readJSON('./generic/breakpoints/breakpoints.json')
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'tmp/',
                    src: ['**/*.html'],
                    dest: 'tmp'
                }]
            }
        },
        // ...
        connect: {
            // ...
            livereload: {
                options: {
                    middleware: function(connect, options) {
                        // Same as in grunt-contrib-connect
                        var middlewares = [];
                        var directory = options.directory || options.base[options.base.length - 1];
                        if (!Array.isArray(options.base)) {
                            options.base = [options.base];
                        }

                        // Here we insert connect-template, use the same pattern to add other middleware
                        middlewares.push(gruntTemplate(directory, grunt.template));

                        // Same as in grunt-contrib-connect
                        options.base.forEach(function(base) {
                            middlewares.push(connect.static(base));
                        });

                        middlewares.push(connect.directory(directory));
                            return middlewares;
                    }
                }
            },
            // ...

```

