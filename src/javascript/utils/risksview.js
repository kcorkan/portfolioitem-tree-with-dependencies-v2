Ext.define('Rally.app.PortfolioItemView',{
    extend: 'Ext.Component',
    alias: 'widget.portfolioview',
    height: 150,
    style: {
        fontFamily: 'ProximaNova',
        fontSize: '14px'
    },
    renderTpl: new Ext.XTemplate(
        '<tpl>',
            '<table class="timeline" style="{[this.getDimensionStyle()]}">',
            '<tr><td class="timeline-label">Planned Start Date:</td>{[this.getPlannedStartDate(values)]}</tr>',
            '<tr><td class="timeline-label">Actual Start Date:</td>{[this.getActualStartDate(values)]}</tr>',
            '<tr><td class="timeline-label">Planned End Date:</td>{[this.getPlannedEndDate(values)]}</tr>',
            '<tr><td class="timeline-label">Actual End Date:</td>{[this.getActualEndDate(values)]}</tr>',
            '</table><br/><br/>',
            '<div>{[this.createRiskLink(values)]}</div><br/>',
            '<div class="timeline-label" style="text-align:left;">Notes:</div>',
            '{[this.getNotes(values)]}',
        '</tpl>',
        {
            getDimensionStyle: function(){
                return 'width: ' + this.width + '; height: ' + this.height + '; line-height: ' + this.height + ';display: inline-block';
            },

            getPlannedStartDate: function (values) {
                console.log('getplannedstartdate',this.context)
                var val = values.PlannedStartDate && Rally.util.DateTime.formatWithDefault(values.PlannedstartDate, this.context) || "Not populated";
                var cls = "timeline-gray";
                if (val === "Not populated"){
                    cls = "timeline-red";
                } 
                var str = Ext.String.format('<td class="{0}">{1}</td>',cls,val);
                console.log('str',str);
                return str; 
            },
            getPlannedEndDate: function (values) {
                
                var val = values.PlannedEndDate && Rally.util.DateTime.formatWithDefault(values.PlannedEndDate, this.context) || "Not populated";
                var cls = "timeline-gray";
                if (val === "Not populated"){
                    cls = "timeline-red";
                } 
                return Ext.String.format('<td class="{0}">{1}</td>',cls,val);
            },
            getActualEndDate: function (values) {
                
                var val = values.ActualEndDate && Rally.util.DateTime.formatWithDefault(values.ActualEndDate, this.context) || null;
                var cls = "timeline-green";
                if (!val){
                    if (values.ActualStartDate){
                        val = "In Progress";
                        cls = "timeline-blue";
                    } else {
                        if (values.DirectChildrenCount > 0){
                            val = "Not Started";
                        } else {
                            val = "Not Defined";
                        }
                        cls = "timeline-red";
                    }
                }
                return Ext.String.format('<td class="{0}">{1}</td>',cls,val);
            }, 
            getActualStartDate: function (values) {
                
                var val = values.ActualStartDate && Rally.util.DateTime.formatWithDefault(values.ActualStartDate, this.context) || null;
                var cls = "timeline-blue";
                if (!val){
                    if (values.DirectChildrenCount > 0){
                        val = "Not Started";
                        cls = "timeline-gray";
                        if (values.PlannedStartDate < Date()){
                            cls = "timeline-red";
                        }
                    } else {
                        val = "Not Defined";
                        cls = "timeline-red";
                    }
                }
                
                return Ext.String.format('<td class="{0}">{1}</td>',cls,val);
            }, 
            createRiskLink: function (data) {
                var riskCount = data.Risks && data.Risks.Count;
                var ref = Rally.util.Ref.getRelativeUri(data);  
                var cls = riskCount > 0 ? "risk" : "no-risk";  
         
                var html = this.createRiskIcon(data.Risks.Count) + Ext.String.format('<a href="/#/detail{0}/risks" target="_blank" class="{2}"><b>{1} Risks</b></a> are associated with this item.',ref,riskCount,cls);
                return  html; 
            },
        
            createRiskIcon: function (riskCount) {
                var className = 'icon-warning risk';
                if (riskCount === 0){
                    className = 'icon-ok no-risk';
                }

                return className ? '<span class="artifact-icon ' + className + '"></span>' : '';
            },
            getNotes: function(values){
                console.log('this',this);
                return values.Notes || "None";
            }
        }
    ),
    config: {
       /**
         * @cfg {Rally.data.Model} (required)
         * The data store record that this card represents
         */
        record: undefined,
        notesField: undefined,
        context: null
    },
    
    constructor: function (config) {
        config = config || {};
        console.log('config',config)
        //console.log(Ext.getClass(config.record).superclass.self.getName());
        if ( config && config.record && !Ext.isEmpty( Ext.getClass(config.record) )) {
            config.record = config.record.getData();
        }
        this.context = config.context;
        this.renderTpl.context = config.context;
        this.mergeConfig(config);
        this.callParent([this.config]);
    }    
    
});
