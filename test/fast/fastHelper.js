var useObjectID = function(value,record) ***REMOVED***
    if ( record.get('ObjectID') ) ***REMOVED***
        return record.get('ObjectID');
    ***REMOVED*** 
    return 0;
***REMOVED***;

var shiftDayBeginningToEnd = function(day) ***REMOVED***
    return Rally.util.DateTime.add(Rally.util.DateTime.add(Rally.util.DateTime.add(day,'hour',23), 'minute',59),'second',59);
***REMOVED***;

Ext.define('mockStory',***REMOVED***
    extend: 'Ext.data.Model',
    fields: [
        ***REMOVED***name:'ObjectID', type: 'int'***REMOVED***,
        ***REMOVED***name:'Name',type:'string'***REMOVED***,
        ***REMOVED***name:'PlanEstimate',type:'int'***REMOVED***,
        ***REMOVED***name:'id',type:'int',convert:useObjectID***REMOVED***,
        ***REMOVED***name:'ScheduleState',type:'string',defaultValue:'Defined'***REMOVED***
    ]
***REMOVED***);

Ext.define('mockIteration',***REMOVED***
    extend: 'Ext.data.Model',
    fields: [
        ***REMOVED***name:'ObjectID', type: 'int'***REMOVED***,
        ***REMOVED***name:'Name',type:'string'***REMOVED***,
        ***REMOVED***name:'StartDate',type:'auto'***REMOVED***,
        ***REMOVED***name:'EndDate',type:'auto'***REMOVED***,
        ***REMOVED***name:'id',type:'int',convert:useObjectID***REMOVED***
    ]
***REMOVED***);

Ext.define('mockCFD',***REMOVED***
    extend: 'Ext.data.Model',
    fields: [
        ***REMOVED***name:'CardCount',type:'int'***REMOVED***,
        ***REMOVED***name:'CardEstimateTotal',type:'int'***REMOVED***,
        ***REMOVED***name:'CardState',type:'string'***REMOVED***,
        ***REMOVED***name:'CardToDoTotal',type:'int'***REMOVED***,
        ***REMOVED***name:'CreationDate',type:'date'***REMOVED***,
        ***REMOVED***name:'ObjectID',type:'int'***REMOVED***,
        ***REMOVED***name:'TaskEstimateTotal',type:'int'***REMOVED***
    ]
***REMOVED***);