var template = './test/fast/templates/custom.tmpl';

exports.process = function(grunt, task, context) ***REMOVED***
	
    var source = grunt.file.read(template);
    return grunt.util._.template(source, context);

***REMOVED***;