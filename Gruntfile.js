// references: https://github.com/request/request#http-authentication
// https://www.npmjs.com/package/grunt-http

module.exports = function(grunt) ***REMOVED***
    require('grunt');

    var config_file_name = 'config.json';
    var auth_file_name = 'auth.json';

    var config = ***REMOVED*** auth: ***REMOVED******REMOVED*** ***REMOVED***;

    if ( grunt.file.exists(config_file_name) ) ***REMOVED***

        config = grunt.file.readJSON(config_file_name);

        if ( config.javascript ) ***REMOVED***
            config.js_files = config.javascript;
        ***REMOVED*** else ***REMOVED***
            config.js_files = grunt.file.expand(['src/javascript/utils/*.js','src/javascript/*.js']);
        ***REMOVED***

        config.ugly_files = grunt.file.expand(['deploy/app.min.*.js']);

        if ( config.css ) ***REMOVED***
            config.css_files = config.css;
        ***REMOVED*** else ***REMOVED***
            config.css_files = grunt.file.expand( 'src/style/*.css' );
        ***REMOVED***

        config.js_contents = " ";
        for (var i=0;i<config.js_files.length;i++) ***REMOVED***
            grunt.log.writeln( config.js_files[i]);
            config.js_contents = config.js_contents + "\n" + grunt.file.read(config.js_files[i]);
        ***REMOVED***

        config.style_contents = "";
        for (var i=0;i<config.css_files.length;i++) ***REMOVED***
            grunt.log.writeln( config.css_files[i]);
            config.style_contents = config.style_contents + "\n" + grunt.file.read(config.css_files[i]);
        ***REMOVED***

        config.ugly_contents = "";
        for ( var i=0;i<config.ugly_files;i++ ) ***REMOVED***
            grunt.file.read(config.ugly_files[i]);
        ***REMOVED***
    ***REMOVED***
    if ( grunt.file.exists(auth_file_name) ) ***REMOVED***
        var auth = grunt.file.readJSON(auth_file_name);
        config.auth = auth
    ***REMOVED*** else ***REMOVED***
        grunt.log.writeln("");
        grunt.log.writeln("WARNING: Slow tests won't run without an auth.json file");
    ***REMOVED***

    grunt.initConfig(***REMOVED***
        pkg: grunt.file.readJSON('package.json'),
        uglify: ***REMOVED***
            options: ***REMOVED***
                mangle: true
            ***REMOVED***,
            ugly: ***REMOVED***
                files: ***REMOVED*** 'deploy/app.min.js': config.js_files ***REMOVED***
            ***REMOVED***
        ***REMOVED***,
        template: ***REMOVED***
                dev: ***REMOVED***
                    src: 'templates/App-debug-tpl.html',
                    dest: 'App-debug.html',
                    engine: 'underscore',
                    variables: config
                ***REMOVED***,

                debugsdk: ***REMOVED***
                    src: 'templates/App-debugsdk-tpl.html',
                    dest: 'deploy/App.txt',
                    engine: 'underscore',
                    variables: config
                ***REMOVED***,

                prod: ***REMOVED***
                    src: 'templates/App-tpl.html',
                    dest: 'deploy/App.txt',
                    engine: 'underscore',
                    variables: config
                ***REMOVED***,

                ugly: ***REMOVED***
                    src: 'templates/App-ugly-tpl.html',
                    dest: 'deploy/Ugly.txt',
                    engine: 'underscore',
                    variables: config
                ***REMOVED***,

                makeauth: ***REMOVED***
                    src: 'templates/auth-tpl.json',
                    dest: './auth.json',
                    engine: 'underscore'
                ***REMOVED***
        ***REMOVED***,
        watch: ***REMOVED***
            files: ['test/fast/**/*-spec.js',config.js_files, config.css_files],
            tasks: ['test-and-deploy']
        ***REMOVED***,
        jasmine: ***REMOVED***
            fast: ***REMOVED***
                src: config.js_files,
                options: ***REMOVED***
                    specs: 'test/fast/**/*-spec.js',
                    helpers: 'test/fast/*Helper.js',
                    template: 'test/fast/custom.tmpl',
                    vendor:[
	                    'node_modules/rally-sdk2-test-utils/src/sdk/' + config.sdk + '/sdk-debug.js',
	                    'node_modules/rally-sdk2-test-utils/dist/sdk2-test-utils.js'
                    ],
                    templateOptions: config,
                    keepRunner: true,
                    junit: ***REMOVED***
                        path: 'test/logs/fast'
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***,
            slow: ***REMOVED***
                src: config.js_files,
                options: ***REMOVED***
                    specs: 'test/slow/*-spec.js',
                    helpers: 'test/slow/*Helper.js',
                    template: 'test/slow/custom.tmpl',
                    templateOptions: config,
                    keepRunner: true,
                    timeout: 50000,
                    junit: ***REMOVED***
                        path: 'test/logs/slow'
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***,
        prompt: ***REMOVED***
            makeauth: ***REMOVED***
                options: ***REMOVED***
                    questions: [
                        ***REMOVED***
                            config: 'template.makeauth.variables.user',
                            type: 'input',
                            message: 'Enter Rally username'
                        ***REMOVED***,
                        ***REMOVED***
                            config: 'template.makeauth.variables.password',
                            type: 'password',
                            message: 'Enter Rally password'
                        ***REMOVED***,
                        ***REMOVED***
                            config: 'template.makeauth.variables.server',
                            type: 'list',
                            message: 'Choose Rally server',
                            default: 'https://rally1.rallydev.com',
                            choices: ['https://rally1.rallydev.com','https://us1.rallydev.com']
                        ***REMOVED***
                    ]
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***);

    grunt.registerTask('putUglyInConfig', 'add results of uglification to the config', function() ***REMOVED***
        config.ugly_contents = grunt.file.read('deploy/app.min.js');
    ***REMOVED***);


    grunt.registerTask('setPostBuildInfo', 'Make a sloppy checksum', function(deploy_file_name) ***REMOVED***
        var fs = require('fs'),
            username = require('username');
            chk = 0x12345678,
            i;

        grunt.log.writeln('deploy file:', deploy_file_name);
        var deploy_file = grunt.file.read(deploy_file_name);

        string = deploy_file.replace(/var CHECKSUM = .*;/,"");
        string = string.replace(/var BUILDER  = .*;/,"");
        string = string.replace(/\s/g,"");  //Remove all whitespace from the string.

        for (i = 0; i < string.length; i++) ***REMOVED***
            chk += (string.charCodeAt(i) * i);
        ***REMOVED***
        var builder = username.sync();
        grunt.log.writeln('setting builder:', builder);

//
       // grunt.template.addDelimiters('square-brackets','[%','%]');

        // var data = ***REMOVED*** checksum: chk, builder: builder ***REMOVED***;
        // var output = grunt.template.process(deploy_file, ***REMOVED***
        //     data: data,
        //     delimiters: 'square-brackets'
        // ***REMOVED***);
        var output = deploy_file; 
        grunt.file.write(deploy_file_name,output);
    ***REMOVED***);

    grunt.registerTask('install', 'Deploy the app to a rally instance', function(deploy_file_name) ***REMOVED***

        if ( ! config.auth ) ***REMOVED***
            grunt.log.writeln("To deploy, define server, username and password in auth.json file");
            return;
        ***REMOVED***
        var valid = true;
        if ( !config.auth.server || config.auth.server == "" ) ***REMOVED***
            grunt.log.writeln("To deploy, server must be defined in the auth.json file");
            valid = false;
        ***REMOVED***

        if ( !config.auth.username || config.auth.username == "" ) ***REMOVED***
            grunt.log.writeln("To deploy, username must be defined in the auth.json file");
            valid = false;
        ***REMOVED***

        if ( !config.auth.password || config.auth.password == "" ) ***REMOVED***
            grunt.log.writeln("To deploy, password must be defined in the auth.json file");
            valid = false;
        ***REMOVED***

        if ( !valid ) ***REMOVED*** return; ***REMOVED***

        var done = this.async();
        var request = require('request');

        var j = request.jar();
        request.defaults(***REMOVED***jar: j***REMOVED***);

        var installApp = function(page_oid,panel_oid) ***REMOVED***
            var html = grunt.file.read(deploy_file_name);

            var uri = config.auth.server + "/slm/dashboard/changepanelsettings.sp";
            grunt.log.writeln('URI:', uri);

            var parameters = ***REMOVED***
                cpoid:10909656256,
                _slug:'/custom/' + page_oid
            ***REMOVED***;

            var payload = ***REMOVED***
                oid: panel_oid,
                settings: JSON.stringify(***REMOVED***
                    "title": config.name,
                    "project": null,
                    "content": html,
                    "autoResize": true
                ***REMOVED***),
                dashboardName: 'myhome' + page_oid
            ***REMOVED***;

            grunt.log.writeln('Installing app:', config.auth.server + "/#/custom/" + page_oid);

            var options = ***REMOVED***
                uri: uri,
                form: payload,
                qs: parameters,
                jar: j
            ***REMOVED***;

            request.post(options, function(error,response,body)***REMOVED***
                if ( response.statusCode != 200 ) ***REMOVED***
                    grunt.log.writeln('oops');
                ***REMOVED***
                grunt.log.writeln('--Deployed--');
            ***REMOVED***);
        ***REMOVED***;

        var makeApp = function(key,page_oid) ***REMOVED***
            var uri = config.auth.server + "/slm/dashboard/addpanel.sp";

            var parameters = ***REMOVED***
                cpoid:10909656256,
                _slug:'/custom/' + page_oid
            ***REMOVED***;

            var payload = ***REMOVED***
                panelDefinitionOid:431632107,
                col:0,
                index:0,
                dashboardName: 'myhome' + page_oid
            ***REMOVED***;

            grunt.log.writeln('Creating app on page', page_oid);

            var options = ***REMOVED***
                uri: uri,
                form: payload,
                qs: parameters,
                jar: j
            ***REMOVED***;

            request.post(options, function(error,response,body)***REMOVED***
                if ( response.statusCode != 200 ) ***REMOVED***
                    grunt.log.writeln('oops');
                ***REMOVED***

                var response_object = JSON.parse(body);

                // save IDs:
                grunt.log.writeln('Save IDs');
                config.auth.pageOid = page_oid;
                config.auth.panelOid = response_object.oid;
                grunt.file.write(auth_file_name,JSON.stringify(config.auth,null,'\t') + "\r\n");

                grunt.log.writeln('Created panel with oid:', response_object.oid);
                installApp(page_oid,response_object.oid);
            ***REMOVED***);
        ***REMOVED***;

        var makePage = function(key) ***REMOVED***
            var uri = config.auth.server + "/slm/wt/edit/create.sp";
            var parameters = ***REMOVED***
                cpoid:729766,
                key: key
            ***REMOVED***;

            var payload = ***REMOVED***
                name: "*" + config.name,
                editorMode: 'create',
                pid: 'myhome',
                oid: 6440917,
                timeboxFilter:'none'
            ***REMOVED***;

            grunt.log.writeln('Creating page:', payload.name);

            var options = ***REMOVED***
                uri: uri,
                form: payload,
                qs: parameters,
                jar: j
            ***REMOVED***;

            request.post(options, function(error,response,body)***REMOVED***
                //grunt.log.writeln('responseCode:', response.statusCode);
                if ( response.statusCode != 200 ) ***REMOVED***
                    grunt.log.writeln('oops');
                    //grunt.log.writeln('--', response.headers);
                    //grunt.log.writeln('--', response.request.headers);
                    //grunt.log.writeln('--', response.request.body);
                ***REMOVED***
                //grunt.log.writeln('response:', response);
                //grunt.log.writeln('response body', body);
                // looking for
                // <input type="hidden" name="oid" value="52337144851"/>
                var page_oid = body.replace(/(.|[\r\n])*name="oid"/,"").replace(/"\/\>(.|[\r\n])*/,"").replace(/.*"/,"");

                grunt.log.writeln('Created', payload.name, " at oid:", page_oid);

                makeApp(key,page_oid)
            ***REMOVED***);
        ***REMOVED***;

        var uri = config.auth.server + "/slm/webservice/v2.0/security/authorize";

        var options = ***REMOVED***
            uri: uri,
            method:'GET',
            auth: ***REMOVED*** 'user': config.auth.username, 'pass': config.auth.password, 'sendImmediately': true ***REMOVED***
        ***REMOVED***;

        grunt.log.writeln('Authenticating on ', config.auth.server, ' as ', config.auth.username);

        request.get(options, function(error,response,body)***REMOVED***
                if ( response.statusCode != 200 ) ***REMOVED***
                    grunt.log.writeln('oops: couldn not log in');
                ***REMOVED*** else ***REMOVED***
                    var json = JSON.parse(body);
                    var key = json.OperationResult.SecurityToken;

                    var cookie = response.headers['set-cookie'];

                    for ( var i=0; i<cookie.length; i++ ) ***REMOVED***
                        j.setCookie(request.cookie(cookie[i]),config.auth.server);
                    ***REMOVED***

                    if (!config.auth.pageOid && !config.auth.panelOid) ***REMOVED***
                        makePage(key);
                    ***REMOVED*** else ***REMOVED***
                        installApp(config.auth.pageOid, config.auth.panelOid);
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***
        );


    ***REMOVED***);

    //load
    grunt.loadNpmTasks('grunt-templater');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-prompt');

    //tasks
    grunt.registerTask('default', ['debug','ugly']);
    grunt.registerTask('makeauth', "Create a new auth.json file for connecting to Rally", ['prompt:makeauth','template:makeauth']);

    // a human readable .txt file
    grunt.registerTask('pretty', "Create the html for deployment",['template:prod','setPostBuildInfo:deploy/App.txt']);
    //
    grunt.registerTask('debug', "Create an html file that can run in its own tab", ['template:dev']);
    //
    grunt.registerTask('ugly', "Create the ugly html for deployment",['uglify:ugly','putUglyInConfig','template:ugly','setPostBuildInfo:deploy/Ugly.txt']);
    //

    grunt.registerTask('test-fast', "Run tests that don't need to connect to Rally", ['jasmine:fast']);
    grunt.registerTask('test-slow', "Run tests that need to connect to Rally", ['jasmine:slow']);

    grunt.registerTask('test-and-deploy', 'Build and deploy app to the location in auth.json',['test-fast','ugly','install:deploy/Ugly.txt']);

    grunt.registerTask('deploy', 'Build and deploy app to the location in auth.json',['ugly','install:deploy/Ugly.txt']);

    grunt.registerTask('deploy-pretty', 'Build and deploy app to the location in auth.json',['pretty','install:deploy/App.txt']);

    grunt.registerTask('deploy-debugsdk', 'Build and deploy app to the location in auth.json',['template:debugsdk', 'setPostBuildInfo:deploy/App.txt', 'install:deploy/App.txt']);
***REMOVED***;