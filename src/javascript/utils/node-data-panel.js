// const ***REMOVED*** __esModule ***REMOVED*** = require("./d3");

Ext.define("Rally.app.portfolioitem.DetailWindow",***REMOVED***
     extend:  'Rally.ui.dialog.Dialog',

    autoShow: true,
    draggable: true,
    closable: true,
    // style: ***REMOVED***
    //     border: "thick solid #000000"
    // ***REMOVED***,
    overflowY: 'scroll',
    overflowX: 'none',
    disableScroll: false,
    layout: 'hbox',
    padding: 0,
    items: [
        ***REMOVED***
            xtype: 'container',
            itemId: 'leftCol',
            flex:1,
            padding: 10
        ***REMOVED***,
        ***REMOVED***
            xtype: 'container',
            itemId: 'rightCol',
            flex: 1,
            padding: 10
        ***REMOVED***
    ],
    //settable configurations
    record: null,
    model: null,
    childField: null,
    width: 1200, 
    height: 800,
    cardFieldDisplayList: null,
    notesFieldName: "Notes",
    portfolioItemTypes: [],
    
    constructor: function(config) ***REMOVED***
        this.mergeConfig(config);
        this.callParent([this.config]);
        this.addEvents('childrenloaded');
        this.setTitle('Information for ' + this.record.get('FormattedID') + ': ' + this.record.get('Name'));  
        this.on('childrenloaded',this.updateDisplay);
        this.loadDescendents(this.record);  
    ***REMOVED***,
    loadDescendents: function(record)***REMOVED***
        var type = record.get('_type').toLowerCase(),
            ordinal = null,
            lowestLevelModel = null;

        _.each(this.portfolioItemTypes, function(p)***REMOVED***
            if (p.get('TypePath').toLowerCase() === type)***REMOVED***
                ordinal = p.get('Ordinal');
            ***REMOVED***
            if (p.get('Ordinal') === 0)***REMOVED***
                lowestLevelModel = p.get('TypePath');
            ***REMOVED***
        ***REMOVED***);
        if (ordinal === 0)***REMOVED***
            lowestLevelModel = 'HierarchicalRequirement';
        ***REMOVED***

        Ext.create('Rally.data.wsapi.Store',***REMOVED***
            model: lowestLevelModel,
            filters: this._getDescendantFilter(record,ordinal),
            fetch: this._getFetchFields(lowestLevelModel),
            pageSize: 2000,
            limit: Infinity,
            context: ***REMOVED***
                project: null
            ***REMOVED***
        ***REMOVED***).load(***REMOVED***
            callback: function(records, operation,success)***REMOVED***
                console.log('recrods',records);
                this.fireEvent('childrenloaded',record,records)
            ***REMOVED***,
            scope: this 
        ***REMOVED***);

    ***REMOVED***,
    _getDescendantFilter: function(record,ordinal)***REMOVED***
         if (ordinal === 0)***REMOVED***
             return [***REMOVED***
                 property: 'PortfolioItem.ObjectID',
                 value: record.get('ObjectID')
             ***REMOVED***]
         ***REMOVED***
         var property = "ObjectID";
         for (var i=0; i<ordinal; i++)***REMOVED*** property = "Parent." + property; ***REMOVED***
         return [***REMOVED***
            property: property,
            value: record.get('ObjectID')
        ***REMOVED***];

    ***REMOVED***,
    _getFetchFields: function(modelName,ordinal)***REMOVED***
        var commonFields = ['Name','Project','Risks'],
            childrenField = "Children";

        if (/portfolioitem/.test(modelName.toLowerCase()))***REMOVED***
            if (ordinal === 0)***REMOVED*** childrenField = "UserStories"; ***REMOVED***
            commonFields = commonFields.concat(['State','DirectChildrenCount','ActualStartDate','ActualEndDate'])
        ***REMOVED*** else ***REMOVED***
            commonFields.push('ScheduleState');
        ***REMOVED***
        return commonFields; 
   
    ***REMOVED***,
    _getFeatureCollectionCount: function(childRecords,collectionName)***REMOVED***
        var collectionCount = 0; 

        _.each(childRecords, function(r)***REMOVED***
            var cnt = r.get(collectionName) && r.get(collectionName).Count || 0; 

            collectionCount += cnt;
        ***REMOVED***);
        return collectionCount;
    ***REMOVED***,
    updateDisplay: function(rootRecord,childRecords)***REMOVED***
        console.log('updateDisplay',rootRecord, childRecords);
        this.down('#leftCol').add(***REMOVED***
            xtype: 'rallycard',
            record: rootRecord,
            fields: this.cardFieldDisplayList,
            showAge: true,
            resizable: false,
            maxHeight: 250
        ***REMOVED***);
        this.down('#rightCol').add(***REMOVED***
            xtype: 'portfolioview',
            renderData: this.record.getData(),
            notesField: this.notesFieldName,
            context: this.context,
            featurePredecessors: this._getFeatureCollectionCount(childRecords,'Predecessors'),
            featureSuccessors: this._getFeatureCollectionCount(childRecords,'Successors')
        ***REMOVED***);
      
        if (childRecords && childRecords.length > 0)***REMOVED***
            this.down('#leftCol').add(***REMOVED***
                xtype:'portfolioimpliedstateprojectdistribution',
                records: childRecords,
                width: '95%'
            ***REMOVED***);
        ***REMOVED*** else ***REMOVED***
            this.down('#leftCol').add(***REMOVED***
                xtype: 'container',
                html: '<span class="timeline-label">No lowest level portfolio items have been defined.</span>'
            ***REMOVED***);
        ***REMOVED***
        
    ***REMOVED***
***REMOVED***);
