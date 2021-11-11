/**
 * A link that pops up a version dialog box
 */

Ext.define('Rally.technicalservices.InfoLink',***REMOVED***
    extend: 'Rally.ui.dialog.Dialog',
    alias: 'widget.tsinfolink',

    /**
     * @cfg ***REMOVED***String***REMOVED*** informationHtml
     * Additional text to be displayed on the popup dialog (for exmaple,
     * to add a description of the app's use or functionality)
     */
    informationHtml: null,

    /**
     *
     * cfg ***REMOVED***String***REMOVED*** title
     * The title for the dialog box
     */
    title: "Build Information",

    defaults: ***REMOVED*** padding: 5, margin: 5 ***REMOVED***,

    closable: true,

    draggable: true,

    autoShow: true,

    width: 350,

    informationalConfig: null,

    showLog: false,
    logger: null,

    items: [
        ***REMOVED***xtype:'container', itemId:'information' ***REMOVED***,
        ***REMOVED***xtype:'container', itemId:'button_box'***REMOVED***
    ],

    initComponent: function() ***REMOVED***
        var id = Ext.id(this);
        this.title =  "<span class='icon-help'> </span>" + this.title;
        this.callParent(arguments);
    ***REMOVED***,

    _generateChecksum: function(string)***REMOVED***
        var chk = 0x12345678,
            i;
        string = string.replace(/var CHECKSUM = .*;/,"");
        string = string.replace(/var BUILDER  = .*;/,"");
        string = string.replace(/\s/g,"");  //Remove all whitespace from the string.

        for (i = 0; i < string.length; i++) ***REMOVED***
            chk += (string.charCodeAt(i) * i);
        ***REMOVED***

        return chk;
    ***REMOVED***,

    _checkChecksum: function(container) ***REMOVED***
        var deferred = Ext.create('Deft.Deferred');
        var me = this;

        Ext.Ajax.request(***REMOVED***
            url: document.URL,
            params: ***REMOVED***
                id: 1
            ***REMOVED***,
            success: function (response) ***REMOVED***
                text = response.responseText;
                if ( CHECKSUM ) ***REMOVED***
                    var stored_checksum = me._generateChecksum(text);
                    if ( CHECKSUM !== stored_checksum ) ***REMOVED***
                        deferred.resolve(false);
                        return;
                    ***REMOVED***
                ***REMOVED***
                deferred.resolve(true);
            ***REMOVED***
        ***REMOVED***);

        return deferred.promise;
    ***REMOVED***,

    _addToContainer: function(container)***REMOVED***
        var config = Ext.apply(***REMOVED***
            xtype:'container',
            height: 200,
            overflowY: true
        ***REMOVED***, this.informationalConfig);

        container.add(config);
    ***REMOVED***,

    afterRender: function() ***REMOVED***
        var app = Rally.getApp();

        if ( !Ext.isEmpty( this.informationalConfig ) ) ***REMOVED***
            var container = this.down('#information');
            this._addToContainer(container);
        ***REMOVED***

        if ( this.showLog && this.logger ) ***REMOVED***
            this.down('#button_box').add(***REMOVED***
                xtype:'rallybutton',
                text:'Show Log',
                listeners: ***REMOVED***
                    scope: this,
                    click: function() ***REMOVED***
                        this.logger.displayLog();
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***);
        ***REMOVED***

        if (! app.isExternal() ) ***REMOVED***
            this._checkChecksum(app).then(***REMOVED***
                scope: this,
                success: function(result)***REMOVED***
                    if ( !result ) ***REMOVED***
                        this.addDocked(***REMOVED***
                            xtype:'container',
                            cls: 'build-info',
                            dock: 'bottom',
                            padding: 2,
                            html:'<span class="icon-warning"> </span>Checksums do not match'
                        ***REMOVED***);
                    ***REMOVED***
                ***REMOVED***,
                failure: function(msg)***REMOVED***
                    console.log("oops:",msg);
                ***REMOVED***
            ***REMOVED***);
        ***REMOVED*** else ***REMOVED***
            this.addDocked(***REMOVED***
                xtype:'container',
                cls: 'build-info',
                padding: 2,
                dock: 'bottom',
                html:'... Running externally'
            ***REMOVED***);
        ***REMOVED***
        this.callParent(arguments);
    ***REMOVED***,

    beforeRender: function() ***REMOVED***
        var me = this;
        this.callParent(arguments);

        if (this.informationHtml) ***REMOVED***
            this.addDocked(***REMOVED***
                xtype: 'component',
                componentCls: 'intro-panel',
                padding: 2,
                html: this.informationHtml,
                dock: 'bottom'
            ***REMOVED***);
        ***REMOVED***

        this.addDocked(***REMOVED***
            xtype:'container',
            cls: 'build-info',
            padding: 2,
            dock:'bottom',
            html:"This app was created by the CA AC Technical Services Team."
        ***REMOVED***);

        if ( APP_BUILD_DATE ) ***REMOVED***
            var build_html = Ext.String.format("Built on: ***REMOVED***0***REMOVED*** <br/>Built by: ***REMOVED***1***REMOVED***",
                APP_BUILD_DATE,
                BUILDER);

            if ( ARTIFACT ) ***REMOVED***
                build_html = build_html + "<br/>Source artifact: " + ARTIFACT;
            ***REMOVED***

            this.addDocked(***REMOVED***
                xtype:'container',
                cls: 'build-info',
                padding: 2,
                dock: 'top',
                html: build_html
            ***REMOVED***);
        ***REMOVED***
    ***REMOVED***
***REMOVED***);
