Ext.define('TSUtilities', ***REMOVED***

    singleton: true,

    loadWsapiRecords: function(config)***REMOVED***
        var deferred = Ext.create('Deft.Deferred');
        var default_config = ***REMOVED***
            model: 'Defect',
            fetch: ['ObjectID']
        ***REMOVED***;
        Ext.create('Rally.data.wsapi.Store', Ext.Object.merge(default_config,config)).load(***REMOVED***
            callback : function(records, operation, successful) ***REMOVED***
                if (successful)***REMOVED***
                    deferred.resolve(records);
                ***REMOVED*** else ***REMOVED***
                    console.error("Failed: ", operation);
                    deferred.reject('Problem loading: ' + operation.error.errors.join('. '));
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***);
        return deferred.promise;
    ***REMOVED***,

    loadAStoreWithAPromise: function(model_name, model_fields)***REMOVED***
        var deferred = Ext.create('Deft.Deferred');

        Ext.create('Rally.data.wsapi.Store', ***REMOVED***
            model: model_name,
            fetch: model_fields
        ***REMOVED***).load(***REMOVED***
            callback : function(records, operation, successful) ***REMOVED***
                if (successful)***REMOVED***
                    deferred.resolve(this);
                ***REMOVED*** else ***REMOVED***
                    console.error("Failed: ", operation);
                    deferred.reject('Problem loading: ' + operation.error.errors.join('. '));
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***);
        return deferred.promise;
    ***REMOVED***
***REMOVED***);
