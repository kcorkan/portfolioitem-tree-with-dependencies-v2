Ext.define("Rally.app.widget.portfolioProjectDistribution",***REMOVED***
    extend: 'Rally.ui.chart.Chart',
    alias: 'widget.portfolioprojectdistribution',

    records: null,
    chartData: ***REMOVED******REMOVED***,
    chartConfig: ***REMOVED***
        chart: ***REMOVED***
            type: 'pie'
        ***REMOVED***,
        title: ***REMOVED***
            text: 'Feature Distribution across Teams',
            style: ***REMOVED***
                color: '#444',
                fontFamily:'ProximaNova',
                textTransform: 'uppercase',
                fill:'#444'
            ***REMOVED***
        ***REMOVED***,

        tooltip: ***REMOVED***
            pointFormat: '***REMOVED***series.name***REMOVED***: <b>***REMOVED***point.percentage:.1f***REMOVED***%</b>',
            style: ***REMOVED***
                color: '#444',
                fontFamily:'ProximaNova',
                textTransform: 'uppercase',
                fill:'#444'
            ***REMOVED***
        ***REMOVED***,
        plotOptions: ***REMOVED***
            pie: ***REMOVED***
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: ***REMOVED***
                    enabled: true,
                    format: '<b>***REMOVED***point.name***REMOVED***</b>: ***REMOVED***point.percentage:.1f***REMOVED*** %',
                    style: ***REMOVED***
                        color: '#444',
                        fontFamily:'ProximaNova',
                        textTransform: 'uppercase',
                        fill:'#444'
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***,
    ***REMOVED***,
    
    constructor: function(config)***REMOVED***
        
        if (config.title)***REMOVED***
            this.chartConfig.title = config.title;
        ***REMOVED***
        this.chartData = this._getChartData(config.records);
        console.log('chartData',this.chartData);
        this.callParent(arguments);
    ***REMOVED***,
    _getChartData: function(records) ***REMOVED***

        var projectHash = _.reduce(records, function(h,r)***REMOVED***
            var pName = r.get('Project').Name; 
            if (!h[pName])***REMOVED*** h[pName] = 0; ***REMOVED***
            h[pName]++;
            return h;  
        ***REMOVED***,***REMOVED******REMOVED***);
        
        var series = ***REMOVED***
            name: 'Teams',
            colorByPoint: true,
            data: []
        ***REMOVED***;
        _.each(projectHash, function(v,k)***REMOVED***
            series.data.push(***REMOVED***
                name: k,
                y: v 
            ***REMOVED***);
        ***REMOVED***);
        console.log('series',series);
        return ***REMOVED***
            series:[series]
        ***REMOVED***;
    ***REMOVED***,


***REMOVED***);