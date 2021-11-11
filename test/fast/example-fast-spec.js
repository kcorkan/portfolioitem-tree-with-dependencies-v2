describe("Example test set", function() ***REMOVED***
    it("should have written tests",function()***REMOVED***
        expect(false).toBe(true);
        expect(Ext.Date.format(new Date(),'Y')).toEqual('2013');
    ***REMOVED***);
    
    it('should render the app', function() ***REMOVED***
        var app = Rally.test.Harness.launchApp("Rally.app.PortfolioItemTreeWithDependenceis");
        expect(app.getEl()).toBeDefined();
    ***REMOVED***);
    
***REMOVED***);
