// const ***REMOVED*** __esModule ***REMOVED*** = require("./d3");

Ext.define("Rally.app.portfolioitem.PresentationPanel",***REMOVED***
    extend:  'Rally.ui.dialog.Dialog',

   autoShow: true,
   draggable: true,
   closable: true,
   // style: ***REMOVED***
   //     border: "thick solid #000000"
   // ***REMOVED***,
   layout:'hbox',
   items: [
    ***REMOVED***
        xtype: 'container',
        itemId: 'presentation',
        flex:1,
        padding: 10,
        height: "100%"
    ***REMOVED***
   ],
   overflowY: 'scroll',
   overflowX: 'none',
   disableScroll: false,
   record: null,
   model: null,
   childField: null,
   width: 1200, 
   height: 800,
   cardFieldDisplayList: null,
   notesFieldName: "Notes",
   portfolioItemTypes: [],

   //Presentation panel settings 
   impactFieldName: 'Notes',
   displayFieldName: '',
   colHeader1: 'Delivered Output',
   colHeader2: 'Impact',
   subtitle: 'Retrospective:  What did we accomplish over the last quarter?',
   node: null, 
   
   constructor: function(config) ***REMOVED***
       this.mergeConfig(config);
       this.callParent([this.config]);
       this.setTitle(this.record.get('Name'));  
       this.updateDisplay();
   ***REMOVED***,
   updateDisplay: function()***REMOVED***
       console.log('updateDisplay',this.node);
       
       var renderData = this.decorateData(this.node);
       
       console.log('renderData',renderData)
       this.down('#presentation').removeAll();
       
       var tpl = new Ext.XTemplate(
           '<div class="title">***REMOVED***Name***REMOVED***</div>',
           '<div class="subtitle">***REMOVED***subtitle***REMOVED***</div>',
           '<table class="presentationtable">',
           '<tr class="tableheader"><td class="tableheadercell">***REMOVED***colheader1***REMOVED***</td><td class="tableheadercell">***REMOVED***colheader2***REMOVED***</td></tr>',
           '<tpl for="children">',     // interrogate the kids property within the data
               '<tr><td class="tablebodycell left">***REMOVED***Name***REMOVED***</td><td class="tablebodycell right">***REMOVED***_impact***REMOVED***</td></tr>',
               '<tpl for="children">',
                    '<tr><td class="tablebodycell left"><li>***REMOVED***Name***REMOVED***</td><td class="tablebodycell right">',
                     '<tpl if="_impact"><li>***REMOVED***_impact***REMOVED***</tpl></td></tr>',
               '</tpl>',
           '</tpl>',
           '</table>'
       );
       
       tpl.overwrite(this.down('#presentation').getEl(),renderData);

        console.log(this.down('#presentation').getSize(),this.down('#presentation').getRegion(),this.getHeight())
   ***REMOVED***,

   decorateData: function(item)***REMOVED***
       var renderData = item.data.record.getData(); 
       renderData.children = []; 

       renderData.subtitle = this.subtitle;
       renderData.colheader1 = this.colHeader1;
       renderData.colheader2 = this.colHeader2;
       //assign _impact field 

       var impactField = this.impactField,
           displayField = this.displayField; 
       for (var i=0; i<item.children.length; i++)***REMOVED***
           var child = item.children[i].data.record.getData();
           child.children = [];
           console.log('child',child);
           if (item.children[i].children && item.children[i].children.length > 0)***REMOVED***
               for (j=0; j<item.children[i].children.length; j++)***REMOVED***
                   var grandchild = item.children[i].children[j].data.record.getData();
                   if (!displayField || child[displayField])***REMOVED***
                        grandchild._impact = grandchild[impactField] || "";
                        child.children.push(grandchild);
                    ***REMOVED***
               ***REMOVED***
           ***REMOVED***
           if (!displayField || child[displayField])***REMOVED***
               child._impact = child[impactField] || "";
               renderData.children.push(child);
           ***REMOVED***
       ***REMOVED***
       console.log('rednerData',renderData)
       return renderData;
   ***REMOVED***       
    
***REMOVED***);
