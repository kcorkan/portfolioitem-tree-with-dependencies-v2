describe("Example slow test", function() ***REMOVED***
    var model;
    var ready_to_test;
    
    var app;
    
    beforeEach(function()***REMOVED***
        model = null;
        ready_to_test = false;
    ***REMOVED***);
    
    it("should have written tests",function()***REMOVED***
        var app = Rally.getApp();
        console.log('app', app);
        runs(function()***REMOVED***          
            Rally.data.ModelFactory.getModel(***REMOVED***
                type: 'Iteration',
                //context: app.getContext(),
                success: function(result) ***REMOVED***
                    console.log('back', result);
                    console.log(result.getName());
                    model = result;
                    ready_to_test = true;
                ***REMOVED***,
                failure: function(msg) ***REMOVED***
                    flag = true;
                    console.log('msg',msg);
                ***REMOVED***
            ***REMOVED***);
        ***REMOVED***);
        
        waitsFor(function() ***REMOVED***
            return ready_to_test;
        ***REMOVED***, "Asynchronous call done");
        
        
        runs (function()***REMOVED***
            expect(model.getName()).toEqual('Iteration');    
        ***REMOVED***);
    ***REMOVED***);
    
    
    
***REMOVED***);
