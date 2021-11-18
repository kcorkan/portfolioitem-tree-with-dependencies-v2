Ext.define('Rally.apps.Legend',***REMOVED***
    extend: 'Ext.Component',
    alias: 'widget.legend',
    /**
     * @cfg ***REMOVED***String***REMOVED***
     * define a width if necessary to fit where it's being used
     */
    width: '160px',
    /**
     * @cfg ***REMOVED***String***REMOVED***
     * define a height if necessary to fit where it's being used
     */
    height: '160px',

    renderTpl: new Ext.XTemplate(
        '<tpl>',
        '<div class="legend-title">***REMOVED***title***REMOVED***</div>',
        '<tpl for="colors">',
            '<div class="legend"><span class="legend-dot ***REMOVED***legendcls***REMOVED***"></span>***REMOVED***legendtext***REMOVED***</div>',
        '</tpl></tpl>'
    ),
    _buildLegendData: function(colorOption)***REMOVED***
            var data = ***REMOVED***
                title: colorOption,
                colors: []
            ***REMOVED***;
            if (colorOption === 'Implied State')***REMOVED***
                data.colors.push(***REMOVED***legendcls: 'not-defined', legendtext: 'Not Defined' ***REMOVED***);
                data.colors.push(***REMOVED***legendcls: 'not-started', legendtext: 'Not Started' ***REMOVED***);
                data.colors.push(***REMOVED***legendcls: 'in-progress', legendtext: 'In Progress' ***REMOVED***);
                data.colors.push(***REMOVED***legendcls: 'done', legendtext: 'Done' ***REMOVED***);
            ***REMOVED***
            if (colorOption === 'Health Color by Count' || colorOption === "Health Color by Estimate")***REMOVED***
                data.colors.push(***REMOVED***legendcls: 'health-white', legendtext: 'Not Started' ***REMOVED***);
                data.colors.push(***REMOVED***legendcls: 'health-green', legendtext: 'On Track' ***REMOVED***);
                data.colors.push(***REMOVED***legendcls: 'health-yellow', legendtext: 'At Risk' ***REMOVED***);
                data.colors.push(***REMOVED***legendcls: 'health-red', legendtext: 'Late' ***REMOVED***);
                data.colors.push(***REMOVED***legendcls: 'health-gray', legendtext: 'Complete' ***REMOVED***);
            ***REMOVED***
           return data; 
    ***REMOVED***,
    constructor: function (config) ***REMOVED***
        config = config || ***REMOVED******REMOVED***;
       
        this.renderData = this._buildLegendData(config.title);
       
        this.mergeConfig(config);
        this.callParent([this.config]);
    ***REMOVED***    
***REMOVED***);