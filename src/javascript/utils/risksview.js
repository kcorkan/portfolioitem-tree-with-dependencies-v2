Ext.define('Rally.app.PortfolioItemView',***REMOVED***
    extend: 'Ext.Component',
    alias: 'widget.portfolioview',
    height: 150,
    style: ***REMOVED***
        fontFamily: 'ProximaNova',
        fontSize: '14px'
    ***REMOVED***,
    renderTpl: new Ext.XTemplate(
        '<tpl>',
            '<table class="timeline" style="***REMOVED***[this.getDimensionStyle()]***REMOVED***">',
            '<tr><td class="timeline-label">Planned Start Date:</td>***REMOVED***[this.getPlannedStartDate(values)]***REMOVED***</tr>',
            '<tr><td class="timeline-label">Actual Start Date:</td>***REMOVED***[this.getActualStartDate(values)]***REMOVED***</tr>',
            '<tr><td class="timeline-label">Planned End Date:</td>***REMOVED***[this.getPlannedEndDate(values)]***REMOVED***</tr>',
            '<tr><td class="timeline-label">Actual End Date:</td>***REMOVED***[this.getActualEndDate(values)]***REMOVED***</tr>',
            '</table><br/><br/><br/>',
            '<div>***REMOVED***[this.createRiskLink(values)]***REMOVED***</div><br/>',
            '<div>***REMOVED***[this.createItemDependencyLink(values)]***REMOVED***</div><br/><br/>',
            '<div class="timeline-label" style="text-align:left;">Notes:</div>',
            '***REMOVED***[this.getNotes(values)]***REMOVED***',
        '</tpl>',
        ***REMOVED***
            getDimensionStyle: function()***REMOVED***
                return 'width: ' + this.width + '; height: ' + this.height + '; line-height: ' + this.height + ';display: inline-block';
            ***REMOVED***,
            getPlannedStartDate: function (values) ***REMOVED***
                console.log('getplannedstartdate',this.context)
                var val = values.PlannedStartDate && Rally.util.DateTime.formatWithDefault(values.PlannedstartDate, this.context) || "Not populated";
                var cls = "timeline-gray";
                if (val === "Not populated")***REMOVED***
                    cls = "timeline-red";
                ***REMOVED*** 
                var str = Ext.String.format('<td class="***REMOVED***0***REMOVED***">***REMOVED***1***REMOVED***</td>',cls,val);
                console.log('str',str);
                return str; 
            ***REMOVED***,
            getPlannedEndDate: function (values) ***REMOVED***
                
                var val = values.PlannedEndDate && Rally.util.DateTime.formatWithDefault(values.PlannedEndDate, this.context) || "Not populated";
                var cls = "timeline-gray";
                if (val === "Not populated")***REMOVED***
                    cls = "timeline-red";
                ***REMOVED*** 
                return Ext.String.format('<td class="***REMOVED***0***REMOVED***">***REMOVED***1***REMOVED***</td>',cls,val);
            ***REMOVED***,
            getActualEndDate: function (values) ***REMOVED***
                
                var val = values.ActualEndDate && Rally.util.DateTime.formatWithDefault(values.ActualEndDate, this.context) || null;
                var cls = "timeline-green";
                if (!val)***REMOVED***
                    if (values.ActualStartDate)***REMOVED***
                        val = "In Progress";
                        cls = "timeline-blue";
                    ***REMOVED*** else ***REMOVED***
                        if (values.DirectChildrenCount > 0)***REMOVED***
                            val = "Not Started";
                        ***REMOVED*** else ***REMOVED***
                            val = "Not Defined";
                        ***REMOVED***
                        cls = "timeline-red";
                    ***REMOVED***
                ***REMOVED***
                return Ext.String.format('<td class="***REMOVED***0***REMOVED***">***REMOVED***1***REMOVED***</td>',cls,val);
            ***REMOVED***, 
            getActualStartDate: function (values) ***REMOVED***
                
                var val = values.ActualStartDate && Rally.util.DateTime.formatWithDefault(values.ActualStartDate, this.context) || null;
                var cls = "timeline-blue";
                if (!val)***REMOVED***
                    if (values.DirectChildrenCount > 0)***REMOVED***
                        val = "Not Started";
                        cls = "timeline-gray";
                        if (values.PlannedStartDate < Date())***REMOVED***
                            cls = "timeline-red";
                        ***REMOVED***
                    ***REMOVED*** else ***REMOVED***
                        val = "Not Defined";
                        cls = "timeline-red";
                    ***REMOVED***
                ***REMOVED***
                
                return Ext.String.format('<td class="***REMOVED***0***REMOVED***">***REMOVED***1***REMOVED***</td>',cls,val);
            ***REMOVED***, 
            createRiskLink: function (data) ***REMOVED***
                var riskCount = data.Risks && data.Risks.Count;
                var ref = Rally.util.Ref.getRelativeUri(data);  
                var cls = riskCount > 0 ? "risk" : "no-risk";  
         
                var html = this.createRiskIcon(data.Risks.Count) + Ext.String.format('<a href="/#/detail***REMOVED***0***REMOVED***/risks" target="_blank" class="***REMOVED***2***REMOVED***"><b>***REMOVED***1***REMOVED*** Risks</b></a> are associated with this item.',ref,riskCount,cls);
                return  html; 
            ***REMOVED***,
            createItemDependencyLink: function(data)***REMOVED***
                
                var dependencyCount = data.Predecessors && data.Predecessors.Count || 0;
                var ref = Rally.util.Ref.getRelativeUri(data);  
                var cls = dependencyCount > 0 ? "risk" : "no-risk";  
                var html = Ext.String.format('<span class="***REMOVED***2***REMOVED*** artifact-icon icon-predecessor"></span><a href="/#/detail***REMOVED***0***REMOVED***/dependencies" target="_blank" class="***REMOVED***2***REMOVED***"><b>***REMOVED***1***REMOVED*** predecessor(s)</b></a>',ref,dependencyCount,cls);
                
                var sCnt = data.Successors && data.Successors.Count || 0;
                var cls = sCnt > 0 ? "risk" : "no-risk";  
                html += Ext.String.format('<br/><br/><span class="***REMOVED***2***REMOVED*** artifact-icon icon-successor"></span><a href="/#/detail***REMOVED***0***REMOVED***/dependencies" target="_blank" class="***REMOVED***2***REMOVED***"><b>***REMOVED***1***REMOVED*** successors(s)</b></a>',ref,sCnt,cls);;

                //html += Ext.String.format('&nbsp;&nbsp;&nbsp;&nbsp;and <a href="/#/detail***REMOVED***0***REMOVED***/children" target="_blank" class="feature-dependency"><b>***REMOVED***1***REMOVED*** Feature predecessor(s)</b></a>.',ref,this.featurePredecessors);
                //html += Ext.String.format('<span class="feature-dependency artifact-icon icon-successor"></span><a href="/#/detail***REMOVED***0***REMOVED***/children" target="_blank" class="feature-dependency"><b>***REMOVED***1***REMOVED*** Feature successor(s)</b></a>.',ref,this.featureSuccessors);
                return  html; 

            ***REMOVED***,
            createRiskIcon: function (riskCount) ***REMOVED***
                var className = 'icon-warning risk';
                if (riskCount === 0)***REMOVED***
                    className = 'icon-ok no-risk';
                ***REMOVED***

                return className ? '<span class="artifact-icon ' + className + '"></span>' : '';
            ***REMOVED***,
            getNotes: function(values)***REMOVED***
                console.log('this',this);
                return values.Notes || "None";
            ***REMOVED***
        ***REMOVED***
    ),
    config: ***REMOVED***
       /**
         * @cfg ***REMOVED***Rally.data.Model***REMOVED*** (required)
         * The data store record that this card represents
         */
        record: undefined,
        notesField: undefined,
        context: null,
        featurePredecessors: null,
        featureSuccessors: null 
    ***REMOVED***,
    
    constructor: function (config) ***REMOVED***
        config = config || ***REMOVED******REMOVED***;
        console.log('config',config)
        //console.log(Ext.getClass(config.record).superclass.self.getName());
        if ( config && config.record && !Ext.isEmpty( Ext.getClass(config.record) )) ***REMOVED***
            config.record = config.record.getData();
        ***REMOVED***
        //this.context = config.context;
        this.renderTpl.context = config.context;
        this.renderTpl.featurePredecessors = config.featurePredecessors;
        this.renderTpl.featureSuccessors = config.featureSuccessors;
        this.mergeConfig(config);
        this.callParent([this.config]);
    ***REMOVED***    
    
***REMOVED***);
