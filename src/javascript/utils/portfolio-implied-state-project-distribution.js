Ext.define("Rally.app.widget.portfolioImpliedStateProjectDistribution",***REMOVED***
    extend: 'Rally.ui.chart.Chart',
    alias: 'widget.portfolioimpliedstateprojectdistribution',

    records: null,
    chartData: ***REMOVED******REMOVED***,
    chartColors : ["#CCCCCC","#999999","#00a9e0","#009933","#CCCCCC","#999999","#00a9e0","#009933"],
    chartConfig: ***REMOVED***
        chart: ***REMOVED***
            type: 'bar',
            marginTop: 100
        ***REMOVED***,
        title: ***REMOVED***
            text: 'Features by Team and Implied State',
            style: ***REMOVED***
                color: '#444',
                fontFamily:'ProximaNova',
                textTransform: 'uppercase',
                fill:'#444'
            ***REMOVED***
        ***REMOVED***,

        // tooltip: ***REMOVED***
        //     pointFormat: '<span style="color:***REMOVED***series.color***REMOVED***">***REMOVED***series.name***REMOVED***</span>: <b>***REMOVED***point.y***REMOVED***</b> (***REMOVED***point.percentage:.0f***REMOVED***%)<br/>',
        //     shared: true
        // ***REMOVED***,
        tooltip: ***REMOVED***
            backgroundColor: '#444',
            headerFormat: '<span style="display:block;margin:0;padding:0 0 2px 0;text-align:center"><b style="font-family:NotoSansBold;color:white;">***REMOVED***point.key***REMOVED***</b></span><table><tbody>',
            footerFormat: '</tbody></table>',
            pointFormat: '<tr><td class="tooltip-label"><span style="color:***REMOVED***series.color***REMOVED***;width=100px;">\u25CF</span> ***REMOVED***series.name***REMOVED***</td><td class="tooltip-point">***REMOVED***point.y***REMOVED***</td></tr>',
            shared: true,
            useHTML: true,
            borderColor: '#444'
        ***REMOVED***,
        xAxis: ***REMOVED***
            title: ***REMOVED***
                text: ''
            ***REMOVED***,
            labels: ***REMOVED***
                style: ***REMOVED***
                    color: '#444',
                    fontFamily:'ProximaNova',
                    textTransform: 'uppercase',
                    fill:'#444'
                ***REMOVED***
            ***REMOVED***,
        ***REMOVED***,
        yAxis: 
            ***REMOVED***
                title: ***REMOVED***
                    text: "Count",
                    style: ***REMOVED***
                        color: '#444',
                        fontFamily:'ProximaNova',
                        textTransform: 'uppercase',
                        fill:'#444'
                    ***REMOVED***
                ***REMOVED***,
                labels: ***REMOVED***
                    style: ***REMOVED***
                        color: '#444',
                        fontFamily:'ProximaNova',
                        textTransform: 'uppercase',
                        fill:'#444'
                    ***REMOVED***
                ***REMOVED***,
                min: 0
            ***REMOVED***,
        legend: ***REMOVED***
            itemStyle: ***REMOVED***
                    color: '#444',
                    fontFamily:'ProximaNova',
                    textTransform: 'uppercase'
            ***REMOVED***,
            align: 'right',
            verticalAlign: 'top',
            layout: 'vertical',
            x: 0,
            y: -10,
            borderWidth: 0,
            floating: true 
        ***REMOVED***,
        plotOptions: ***REMOVED***
            series: ***REMOVED***
                stacking: 'normal'
            ***REMOVED***
        ***REMOVED***,
    ***REMOVED***,
    
    constructor: function(config)***REMOVED***
        
        if (config.title)***REMOVED***
            this.chartConfig.title = config.title;
        ***REMOVED***
        this.chartData = this._getChartData(config.records);
        if (this.showPercent)***REMOVED***
            this.chartConfig.plotOptions.column.stacking = "percent";
            this.chartConfig.yAxis.title.text = "Percentage"
        ***REMOVED***
        console.log('chartData',this.chartData);
        this.callParent(arguments);
    ***REMOVED***,
    _getChartData: function(records) ***REMOVED***

        if (!records || records.length === 0)***REMOVED***
            this._setErrorMessage(this.queryErrorMessage);
            return;
        ***REMOVED***

        var impliedStates = ['Not Defined','Not Started','In Progress','Done'];
        var projectHash = _.reduce(records, function(h,r)***REMOVED***
            var pName = r.get('Project').Name; 
            var pImpliedState = impliedStates[0];
            if (r.get('DirectChildrenCount') > 0)***REMOVED***
                pImpliedState = impliedStates[1];
                if (r.get('ActualStartDate'))***REMOVED***
                    pImpliedState = impliedStates[2];
                    if (r.get('ActualEndDate'))***REMOVED***
                        pImpliedState = impliedStates[3];
                    ***REMOVED*** 
                ***REMOVED***
            ***REMOVED***
            if (!h[pName])***REMOVED*** h[pName] = ***REMOVED******REMOVED***; ***REMOVED***
            if (!h[pName][pImpliedState])***REMOVED*** h[pName][pImpliedState] = 0; ***REMOVED***
            h[pName][pImpliedState]++;
            return h;  
        ***REMOVED***,***REMOVED******REMOVED***);
        
        var categories = _.keys(projectHash);

        // categories = Ext.Array.sort(categories, function(c,d)***REMOVED***
        //     var data_c = projectHash[c] || ***REMOVED******REMOVED***,
        //         data_d = projectHash[d] || ***REMOVED******REMOVED***;
        //     data_c = _.values(data_c);
        //     data_d = _.values(data_d);
        //     console.log('data',data_c,Ext.Array.sum(data_c));
        //     return Ext.Array.sum(data_c) > Ext.Array.sum(data_d);
        // ***REMOVED***);
        
        var series = [];
            
        for (var i=0; i<impliedStates.length; i++)***REMOVED***
            var data = [],
                state = impliedStates[i];
            for (var j=0; j< categories.length; j++)***REMOVED***
                var prj = categories[j];
                var val = projectHash[prj] && projectHash[prj][state] || 0;
                data.push(val);
            ***REMOVED***
            series.push(***REMOVED***
                name: state,
                data: data 
            ***REMOVED***);                
        ***REMOVED***

        return ***REMOVED***
            series:series,
            categories: categories
        ***REMOVED***;
    ***REMOVED***,


***REMOVED***);