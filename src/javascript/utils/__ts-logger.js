/*
 * originally written for when we supported older versions of IE that wouldn't
 * deal with console.log.
 *
 * Now allows for saving log.
 */
Ext.define('CArABU.technicalservices.Logger',***REMOVED***

    saveForLater: false,
    saveLines: 100,
    logArray: [],

    constructor: function(config)***REMOVED***
        Ext.apply(this,config);
    ***REMOVED***,

    setSaveForLater: function(saveme)***REMOVED***
        this.saveForLater = saveme;
    ***REMOVED***,

    log: function(args)***REMOVED***
        var timestamp = "[ " + Ext.util.Format.date(new Date(), "Y-m-d H:i:s.u") + " ]";

        var output_args = [];
        output_args = Ext.Array.push(output_args,[timestamp]);
        output_args = Ext.Array.push(output_args, Ext.Array.slice(arguments,0));

        if ( this.saveForLater ) ***REMOVED***
            if ( !this.logArray) ***REMOVED***
                this.logArray = [];
            ***REMOVED***
            this.logArray.push(output_args.join(' '));

            if ( this.logArray.length > this.saveLines ) ***REMOVED***
                this.logArray.shift();
            ***REMOVED***
        ***REMOVED***

        window.console && console.log.apply(console,output_args);
    ***REMOVED***,

    getLogText: function() ***REMOVED***
        if ( ! this.logArray || this.logArray.length === 0 ) ***REMOVED*** return "-- no log --"; ***REMOVED***
        return this.logArray.join('<br/>');
    ***REMOVED*** ,

    displayLog: function() ***REMOVED***
        var text = this.getLogText();

        this.popup = Ext.create('Rally.ui.dialog.Dialog', ***REMOVED***
            width      : Ext.getBody().getWidth() - 20,
            height     : Ext.getBody().getHeight() - 20,
            closable   : true,
            title      : 'Log',
            autoShow   : true,
            layout     : 'border',
            defaults   : ***REMOVED***
                layout : 'fit',
                width  : '50%',
                border : false
            ***REMOVED***,
            items: [***REMOVED***
                region : 'center',
                xtype: 'container',
                html: text,
                autoScroll: true
            ***REMOVED***]
        ***REMOVED***);
    ***REMOVED***
***REMOVED***);
