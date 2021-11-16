Ext.define("Rally.app.PortfolioItemTreeWithDependenceis", ***REMOVED***
    extend: 'Rally.app.App',
    componentCls: 'app',
    logger: new CArABU.technicalservices.Logger(),
    defaults: ***REMOVED*** margin: 10 ***REMOVED***,
    //layout: 'border',

    integrationHeaders : ***REMOVED***
        name : "Rally.app.PortfolioItemTreeWithDependenceis"
    ***REMOVED***,

    config: ***REMOVED***
        defaultSettings: ***REMOVED***
            keepTypesAligned: true,
            hideArchived: true,
            showFilter: true,
            allowMultiSelect: false,
            colorOption: 'Implied State'
        ***REMOVED***
    ***REMOVED***,
     
    itemId: 'rallyApp',
    MIN_COLUMN_WIDTH:   200,        //Looks silly on less than this
    MIN_ROW_HEIGHT: 20 ,                 //
    LOAD_STORE_MAX_RECORDS: 100, //Can blow up the Rally.data.wsapi.filter.Or
    WARN_STORE_MAX_RECORDS: 300, //Can be slow if you fetch too many
    NODE_CIRCLE_SIZE: 8,                //Pixel radius of dots
    LEFT_MARGIN_SIZE: 100,               //Leave space for "World view" text
    STORE_FETCH_FIELD_LIST:
        [
            'Name',
            'FormattedID',
            'Parent',
            'DragAndDropRank',
            'Children',
            'ObjectID',
            'Project',
            'DisplayColor',
            'Owner',
            'Blocked',
            'BlockedReason',
            'Ready',
            'Tags',
            'Workspace',
            'RevisionHistory',
            'CreationDate',
            'PercentDoneByStoryCount',
            'PercentDoneByStoryPlanEstimate',
            'PredecessorsAndSuccessors',
            'State',
            'PreliminaryEstimate',
            'ActualStartDate',
            'ActualEndDate',
            'DirectChildrenCount',
            'Description',
            'Notes',
            'Predecessors',
            'Successors',
            'OrderIndex',   //Used to get the State field order index
            'PortfolioItemType',
            'Ordinal',
            'Release',
            'Iteration',
            'Milestones',
            'Risks'
        ],
    CARD_DISPLAY_FIELD_LIST:
        [
            'Name',
            'Owner',
            'PreliminaryEstimate',
            'Parent',
            'Project',
            'PercentDoneByStoryCount',
            'PercentDoneByStoryPlanEstimate',
            'PredecessorsAndSuccessors',
            'State',
            'Milestones'
        ],

        timer: null,
        _nodeTree: null,
        //Continuation point after selectors ready/changed
        
        _resetTimer: function(callFunc) ***REMOVED***
            if ( gApp.timer) ***REMOVED*** clearTimeout(gApp.timer);***REMOVED***
            gApp.timer = setTimeout(callFunc, 2000);    //Debounce user selections to the tune of two seconds
        ***REMOVED***,
        //Set the SVG area to the surface we have provided
        _setSVGSize: function(surface) ***REMOVED***
            var svg = d3.select('svg');
            svg.attr('width', surface.getEl().dom.clientWidth);
            svg.attr('height',surface.getEl().dom.clientHeight);
        ***REMOVED***,
        _getViewBoxSize: function(nodeTree,includeMargin)***REMOVED***
    
            var numColumns = gApp._getSelectedOrdinal()+1; //Leave extras for offset at left and text at right??
            var margin=0;
            
            var columnWidth = this.getSize().width/numColumns;
            if (includeMargin)***REMOVED***
                margin = columnWidth + (2*gApp.LEFT_MARGIN_SIZE)
            ***REMOVED***
            
            columnWidth = columnWidth > gApp.MIN_COLUMN_WIDTH ? columnWidth : gApp.MIN_COLUMN_WIDTH;
            treeboxHeight = ((nodeTree.leaves().length +1) * gApp.MIN_ROW_HEIGHT) + 10;
       
            console.log('viewBoxSize',columnWidth * numColumns, treeboxHeight);
        
            return [columnWidth * numColumns - margin, treeboxHeight];
        ***REMOVED***,
        redrawTree: function(records) ***REMOVED***
            if (gApp._nodeTree) ***REMOVED***
                d3.select("#tree").remove();
                gApp._nodeTree = null;
            ***REMOVED***
            this.down('#treeContainer').removeAll(); 
            
            this.down('#treeContainer').add(***REMOVED***
                xtype: 'portfolioitemtree',
                itemId: 'rootSurface',
                margin: '5 5 5 5',
                //layout: 'auto',
                title: 'Loading...',
                autoEl: ***REMOVED***
                    tag: 'svg'
                ***REMOVED***,
                visible: false
            ***REMOVED***);

            //Get all the nodes and the "Unknown" parent virtual nodes
            var nodetree = gApp._createTree(records);
            console.log('nodeTree',nodetree)
            
            //It is hard to calculate the exact size of the tree so we will guess here
            //When we try to use a 'card' we will need the size of the card
            var svg = d3.select('svg');
            var viewBoxSize = gApp._getViewBoxSize(nodetree);
            
            //Make surface the size available in the viewport (minus the selectors and margins)
            var rs = this.down('#rootSurface');
            rs.getEl().setWidth(viewBoxSize[0]);
            rs.getEl().setHeight(viewBoxSize[1]);
            //Set the svg area to the surface
            this._setSVGSize(rs);
            svg.attr('class', 'rootSurface');
            svg.attr('preserveAspectRatio', 'none');
            svg.attr('viewBox', '0 0 ' + viewBoxSize[0] + ' ' + (viewBoxSize[1]+ gApp.NODE_CIRCLE_SIZE));
    
            gApp._nodeTree = nodetree;      //Save for later
            g = svg.append("g")        
                .attr("transform","translate(" + gApp.LEFT_MARGIN_SIZE + ",10)")
                .attr("id","tree");
            //For the size, the tree is rotated 90degrees. Height is for top node to deepest child
            var tree = null;
            var marginViewBoxSize = gApp._getViewBoxSize(nodetree,true)
            if (this.getSetting('keepTypesAligned')) ***REMOVED***
                tree = d3.tree()
                    .size([marginViewBoxSize[1], marginViewBoxSize[0]])     //Take off a chunk for the text??
                    .separation( function(a,b) ***REMOVED***
                            return ( a.parent == b.parent ? 1 : 2); //All leaves equi-distant
                        ***REMOVED***
                    );
            ***REMOVED***
            else ***REMOVED***
                 tree = d3.cluster()
                    .size([marginViewBoxSize[1], marginViewBoxSize[0]])     //Take off a chunk for the text??
                    .separation( function(a,b) ***REMOVED***
                            return ( a.parent == b.parent ? 1 : 1); //All leaves equi-distant
                        ***REMOVED***
                    );
            ***REMOVED***
            tree(nodetree);
            gApp.tree = tree;
            gApp._refreshTree();
        ***REMOVED***,
    
        // _getColourFromModel: function(record)
        // ***REMOVED***
        //     var theStore = null;
    
        //      //We can find the original type that the state Store is from by looking into the value of the filters
        //     _.each(gApp.stateStores, function(store) ***REMOVED***
        //         if (store.modelType.type == record.get('_type'))***REMOVED***
        //             theStore = store;
        //         ***REMOVED***
        //     ***REMOVED***);
        //     if (theStore) ***REMOVED***
        //         return theStore.findBy( function(theState) ***REMOVED***    //Get the index of the store from the State Name
        //             return theState.get('Name') == record.get('State').Name;
        //         ***REMOVED***);
        //     ***REMOVED***
        //     else ***REMOVED***
        //         return 0;
        //     ***REMOVED***
        // ***REMOVED***,
        getPercentDoneName: function()***REMOVED***
            //TODO depends on setting 
            return "PercentDoneByStoryPlanEstimate";
        ***REMOVED***,
        _getDotColor: function(d)***REMOVED***
            var colorSetting = gApp.getSetting('colorOption') || 'Implied State';
            
            if (colorSetting === 'Display Color')***REMOVED***
                return d.data.record.get('DisplayColor');
            ***REMOVED***
           
            if (colorSetting === 'Health Color')***REMOVED***
                var colorObject = Rally.util.HealthColorCalculator.calculateHealthColorForPortfolioItemData(d.data.record.getData(), this.percentDoneName);
                return colorObject.hex;
            ***REMOVED***
           
            var colorObject = '#CCCCCC'; //'#EE1C25';
            if (d.data.record.get('DirectChildrenCount') > 0)***REMOVED***
                colorObject = '#999999'; //'#FAD200';
                if (d.data.record.get('ActualStartDate'))***REMOVED***
                    colorObject = '#00a9e0';
                    if (d.data.record.get('ActualEndDate'))***REMOVED***
                        colorObject = '#009933'
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***
            return colorObject;
        ***REMOVED***,
        _getCircleClass: function(d)***REMOVED***
            var lClass = "dotOutline"; // Might want to use outline to indicate something later

            if (d.data.record.data._ref !== 'root') ***REMOVED***
                if (d.data.record.get('PredecessorsAndSuccessors') && d.data.record.get('PredecessorsAndSuccessors').Count > 0) lClass = "gotDependencies";
                if (d.data.record.data.ObjectID)***REMOVED***
                    if (!d.data.record.get('State')) return "error--node";      //Not been set - which is an error in itself
                    lClass += ' q' + gApp._getDotColor(d); 
                    //lClass +=  ' q' + gApp._getColourFromModel(d.data.record) + '-' + gApp.numStates[gApp._getOrdFromModel(d.data.record.get('_type'))];
                    //lClass +=  ' q' + ((d.data.record.get('State').index) + '-' + gApp.numStates[gApp._getOrdFromModel(d.data.record.get('_type'))]);
                    //lClass += gApp._dataCheckForItem(d);
                ***REMOVED*** else ***REMOVED***
                    return d.data.error ? "error--node": "no--errors--done";
                ***REMOVED***
            ***REMOVED***
            return lClass;
        ***REMOVED***,
        _getTextClass: function(d)***REMOVED***
            var lClass = "normalText"; // Might want to use outline to indicate something later
            var deferred = [];
            if (d.data.record.data._ref !== 'root') ***REMOVED***
                if (d.data.record.get('Successors').Count > 0) ***REMOVED***
                    lClass = "gotSuccText";
                    deferred.push(d.data.record.getCollection('Successors').load());
                ***REMOVED***
                if (d.data.record.get('Predecessors').Count > 0) ***REMOVED***
                    lClass = "gotPredText";
                    deferred.push(d.data.record.getCollection('Predecessors').load());
                ***REMOVED***  
                if (deferred.length > 0) ***REMOVED***
                    Deft.Promise.all(deferred, gApp).then(***REMOVED***
                        success: function(responses) ***REMOVED***
                            var outOfScope = false;
                            _.each(responses, function(response) ***REMOVED***
                                _.each(response, function(record)***REMOVED***
                                    if (!gApp._findNode(gApp._nodes, record.data)) ***REMOVED***
                                        outOfScope = true;
                                    ***REMOVED***
                                ***REMOVED***);
                            ***REMOVED***);
                            //When you get here, outOfScope will indicate that there are successors or predecessors out of scope
                            // If true, make the text blink (Note: async callback behaviour means you have to d3.select the item again)
                            if (outOfScope) ***REMOVED***
                                var lg = d3.select('#' + gApp._getNodeId(d));
                                lg.call(function(d) ***REMOVED*** d.attr('class', 'textBlink ' + d.attr('class'));***REMOVED***);
                            ***REMOVED***
                        ***REMOVED***,
                        failure: function(error) ***REMOVED***
                            console.log('Failed to get dependencies for: ' + d.data.record.get('FormattedID'));
                        ***REMOVED***
                    ***REMOVED***);
                ***REMOVED***
            ***REMOVED***
            return lClass;
        ***REMOVED***,
        _getNodeText: function(d)***REMOVED***
            var titleText = d.children ? d.data.Name : d.data.Name + ' ' + (d.data.record && d.data.record.data.Name); 
            console.log('titleText',titleText);
            if ((d.data.record.data._ref !== 'root') && gApp.getSetting('showExtraText')) ***REMOVED***
                var prelimName = d.data.record.get('PreliminaryEstimate') && d.data.record.get('PreliminaryEstimate').Name || "";
                if (prelimName)***REMOVED***
                    titleText += ' (' + prelimName + ')' ;
                ***REMOVED***
            ***REMOVED***
            return titleText; 
        ***REMOVED***,
        _getNodeId: function(d)***REMOVED***
            var nodeId = Ext.id();
            if (d && d.data && d.data.record && d.data.record.get('FormattedID') && d.data.record.get('FormattedID') !== 'root') ***REMOVED*** 
                nodeId = d.data.record.get('FormattedID');
            ***REMOVED***
            return  'text' + nodeId;
        ***REMOVED***,
        _refreshTree: function()***REMOVED***
            console.log('refreshTree')
            var g = d3.select('#tree');
            var nodetree = gApp._nodeTree;
    
             g.selectAll(".link")
                .data(nodetree.descendants().slice(1))
                .enter().append("path")
                .attr("class", function(d) ***REMOVED*** return d.data.invisibleLink? "invisible--link" :  "local--link" ;***REMOVED***)
                .attr("d", function(d) ***REMOVED***
                        return "M" + d.y + "," + d.x +
                             "C" + (d.parent.y + 100) + "," + d.x +
                             " " + (d.parent.y + 100) + "," + d.parent.x +
                             " " + d.parent.y + "," + d.parent.x;
                ***REMOVED***)
                ;
            var node = g.selectAll(".node")
                .data(nodetree.descendants())
                .enter().append("g")
                .attr("transform", function(d) ***REMOVED*** return "translate(" + d.y + "," + d.x + ")"; ***REMOVED***);
    
            //We're going to set the colour of the dot depndent on some criteria (in this case only  'State'
             node.append("circle")
                .attr("r", gApp.NODE_CIRCLE_SIZE)
                .attr("class", this._getCircleClass)
                .style("fill", this._getDotColor)
                .on("click", gApp._nodeClick)
                .on("mouseover", gApp._nodeMouseOver)
                .on("mouseout", gApp._nodeMouseOut);
    
            node.append("text")
                  .attr("dy", 3)
                  .attr('id', gApp._getNodeId)
                  .attr("x", gApp._textXPos)
                  .attr("y", gApp._textYPos)
                  .attr("class", gApp._getTextClass)
                  .style("text-anchor", gApp._textAnchor)
                  .text(gApp._getNodeText);
        ***REMOVED***,
    
        _textXPos: function(d)***REMOVED***
            return d.children ? -(gApp.NODE_CIRCLE_SIZE + 5) : (gApp.NODE_CIRCLE_SIZE + 5);
        ***REMOVED***,
    
        _textYPos: function(d)***REMOVED***
            return d.children  ? -5 : 0;
        ***REMOVED***,
    
        _textAnchor: function(d)***REMOVED***
            if (!d.children && d. parent) return 'start';
            return 'end';
        ***REMOVED***,
    
        _hideLinks: function()***REMOVED***
            var tree = d3.select('#tree');
            var links = tree.selectAll('path');
            links.attr("visibility","hidden");
        ***REMOVED***,
    
        _showLinks: function()***REMOVED***
            var tree = d3.select('#tree');
            var links = tree.selectAll('path');
            links.attr("visibility","visible");
        ***REMOVED***,
        
        _nodeMouseOut: function(node, index,array)***REMOVED***
            if (node.card) node.card.hide();
        ***REMOVED***,
    
        _nodeMouseOver: function(node,index,array) ***REMOVED***
            if (!(node.data.record.data.ObjectID)) ***REMOVED***
                //Only exists on real items, so do something for the 'unknown' item
                return;
            ***REMOVED*** else ***REMOVED***
    
                if ( !node.card) ***REMOVED***
                    var card = Ext.create('Rally.ui.cardboard.Card', ***REMOVED***
                        'record': node.data.record,
                        fields: gApp.CARD_DISPLAY_FIELD_LIST,
                        constrain: false,
                        width: gApp.MIN_COLUMN_WIDTH,
                        height: 'auto',
                        floating: true, //Allows us to control via the 'show' event
                        shadow: false,
                        showAge: true,
                        resizable: true,
                        listeners: ***REMOVED***
                            show: function(card)***REMOVED***
                                //Move card to one side, preferably closer to the centre of the screen
                                var xpos = array[index].getScreenCTM().e - gApp.MIN_COLUMN_WIDTH;
                                var ypos = array[index].getScreenCTM().f;
                                card.el.setLeftTop( (xpos - gApp.MIN_COLUMN_WIDTH) < 0 ? xpos + gApp.MIN_COLUMN_WIDTH : xpos - gApp.MIN_COLUMN_WIDTH, 
                                    (ypos + this.getSize().height)> gApp.getSize().height ? gApp.getSize().height - (this.getSize().height+20) : ypos);  //Tree is rotated
                            ***REMOVED***
                        ***REMOVED***
                    ***REMOVED***);
                    node.card = card;
                ***REMOVED***
                node.card.show();
            ***REMOVED***
        ***REMOVED***,
    
        _nodePopup: function(node) ***REMOVED***
            if (node.data.record.get('PredecessorsAndSuccessors')) ***REMOVED***
                Ext.create('Rally.ui.popover.DependenciesPopover',
                    ***REMOVED***
                        record: node.data.record,
                        target: node.card.el
                    ***REMOVED***
                );
            ***REMOVED***
            else ***REMOVED***
                Rally.ui.notify.Notifier.show(***REMOVED***message: 'No dependencies available for "' + node.data.record.get('FormattedID') + ": " + node.data.record.get('Name') + '"'***REMOVED***);
            ***REMOVED***
        ***REMOVED***,
    
        _nodeClick: function (node,index,array) ***REMOVED***
            if (!(node.data.record.data.ObjectID)) return; //Only exists on real items
            //Get ordinal (or something ) to indicate we are the lowest level, then use "UserStories" instead of "Children"
            if (event.shiftKey) ***REMOVED*** 
                gApp._nodePopup(node,index,array); 
            ***REMOVED***  else ***REMOVED***
                gApp._dataPanel(node,index,array);
            ***REMOVED***
        ***REMOVED***,
    
        _dataPanel: function(node, index, array) ***REMOVED***        
            var childField = node.data.record.hasField('Children')? 'Children' : 'UserStories';
            var model = node.data.record.hasField('Children')? node.data.record.data.Children._type : 'UserStory';
            
            if (model != "UserStory")***REMOVED***
                Ext.create('Rally.app.portfolioitem.DetailWindow',***REMOVED***
                    record: node.data.record,
                    model: model,
                    childField: childField,
                    cardFieldDisplayList: gApp.CARD_DISPLAY_FIELD_LIST,
                    portfolioItemTypes: this.portfolioItemTypes,
                    height: this.getHeight() * .90,
                    width: this.getWidth() * .75,
                    context: this.getContext()
                ***REMOVED***);
            ***REMOVED***
            
        ***REMOVED***,
    
        _dataCheckForItem: function(d)***REMOVED***
            return "";
        ***REMOVED***,
        //Entry point after creation of render box
        // _onElementValid: function(rs) ***REMOVED***
        //     gApp.timeboxScope = gApp.getContext().getTimeboxScope(); 
        //     //Add any useful selectors into this container ( which is inserted before the rootSurface )
        //     //Choose a point when all are 'ready' to jump off into the rest of the app
        //     var hdrBoxConfig = ***REMOVED***
        //         xtype: 'container',
        //         itemId: 'headerBox',
        //         layout: 'hbox',
        //         items: [
                    
        //             ***REMOVED***
        //                 xtype:  'rallyupperportfolioitemtypecombobox',
        //                 itemId: 'piType',
        //                 fieldLabel: 'Choose Portfolio Type :',
        //                 labelWidth: 100,
        //                 margin: '5 0 5 20',
        //                 defaultSelectionPosition: 'first',
        //                 // storeConfig: ***REMOVED***
        //                 //     additionalFilters: [***REMOVED***
        //                 //                    property: "Ordinal",
        //                 //                    operator: ">",
        //                 //                    value: 0
        //                 //                ***REMOVED***]
        //                 // ***REMOVED***,
        //             //    storeConfig: ***REMOVED***
        //             //        filters: [***REMOVED***
        //             //            property: "Ordinal",
        //             //            operator: ">",
        //             //            value: 0
        //             //        ***REMOVED***],
        //             //        sorters: ***REMOVED***
        //             //            property: 'Ordinal',
        //             //            direction: 'ASC'
        //             //        ***REMOVED***
        //             //    ***REMOVED***,
        //                 listeners: ***REMOVED***
        //                     select: function() ***REMOVED*** gApp._kickOff();***REMOVED***,    //Jump off here to add portfolio size selector
        //                     ready: function() ***REMOVED*** gApp._addColourHelper(); ***REMOVED***
        //                 ***REMOVED***
        //             ***REMOVED***,
        //         ]
        //     ***REMOVED***;
            
        //     var hdrBox = this.insert (0,hdrBoxConfig);
            
        // ***REMOVED***,
    
        numStates: [],
        stateStores: [],
        colourBoxSize: null,
    
        // _addColourHelper: function() ***REMOVED***
        //    // var hdrBox = gApp.down('#headerBox');
        //     var numTypes = gApp._highestOrdinal() + 1;
        //     //var modelList = gApp._getTypeList(numTypes);  //Doesn't matter if we are one over here.
    
        //     //Get the SVG surface and add a new group
        //     //var svg = d3.select('svg');
        //     //Set a size big enough to hold the colour palette (which may get bigger later)
        //     gApp.colourBoxSize = [gApp.MIN_COLUMN_WIDTH*numTypes, 20 * gApp.MIN_ROW_HEIGHT];   //Guess at a maximum of 20 states per type
        //     console.log('colorboxsize',gApp.colourBoxSize);
        //     //Make surface the size available in the viewport (minus the selectors and margins)
        //     // var rs = this.down('#rootSurface');
        //     // rs.getEl().setWidth(gApp.colourBoxSize[0]);
        //     // rs.getEl().setHeight(gApp.colourBoxSize[1]);
        //     // //Set the svg area to the surface
        //     // this._setSVGSize(rs);
        //     // Set the view dimensions in svg to match
        //     //svg.attr('class', 'rootSurface');
        //     //svg.attr('preserveAspectRatio', 'none');
        //     // svg.attr('viewBox', '0 0 ' + gApp.colourBoxSize[0] + ' ' + (gApp.colourBoxSize[1]+ gApp.NODE_CIRCLE_SIZE));
        //     // var colours = svg.append("g")    //New group for colours
        //     //     .attr("id", "colourLegend")
        //     //     .attr("transform","translate(" + gApp.LEFT_MARGIN_SIZE + ",10)");
        //     //Add some legend specific sprites here
    
        //     // _.each(modelList, function(modeltype,idx) ***REMOVED***
        //     //     gApp._addColourBox(modeltype,idx);
        //     // ***REMOVED***);
    
        // ***REMOVED***,
    
    //     _addColourBox: function(modeltype, modelNum) ***REMOVED***
    // //        var colourBox = d3.select('#colourLegend' + modelNum);
            
    //         var colours = d3.select('#colourLegend');
    // //        if (!colourBox) ***REMOVED***
    //             colours.append("g")
    //                 .attr("id", "colourLegend" + modeltype.Ordinal)
    //                 .attr("transform","translate(" + (gApp.MIN_COLUMN_WIDTH*modeltype.Ordinal) + ",10)");
    // //        ***REMOVED***
    //         var colourBox = d3.select('#colourLegend' + modeltype.Ordinal);
    //             var lCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    //             colourBox.append("text")
    //                 .attr("dx", -gApp.NODE_CIRCLE_SIZE )
    //                 .attr("dy", -(gApp.NODE_CIRCLE_SIZE+2))
    //                 .attr("x",  0)
    //                 .attr("y", 0)
    // //              .style("text-anchor", "start" )
    //                 .style("text-anchor",  'start')
    //                 .text(modeltype.Name);
    
    //             //Now fetch all the values for the State field
    //             //And then add the colours
    //             var stateStore = Ext.create('Rally.data.wsapi.Store',
    //                 ***REMOVED***
    //                     model: 'State',
    //                     filters: [***REMOVED***
    //                         property: 'TypeDef',
    //                         value: modeltype.ref
    //                     ***REMOVED***,
    //                     ***REMOVED***
    //                         property: 'Enabled',
    //                         value: true
    //                     ***REMOVED***],
    //                     context: gApp.getContext().getDataContext(),
    //                     fetch: true,
    //                     modelType: modeltype
    //                 ***REMOVED***
    //             );
    //             stateStore.load().then(***REMOVED*** 
    //                 success: function(records)***REMOVED***
    //                     gApp.numStates[modelNum] = _.max(_.pluck(records, function( record) ***REMOVED***
    //                         return record.get('OrderIndex');***REMOVED***
    //                     ));
    //                     _.each(records, function(state)***REMOVED***
    //                         var idx = state.get('OrderIndex');
    //                         colourBox.append("circle")
    //                             .attr("cx", 0)
    //                             .attr("cy", state.index * gApp.MIN_ROW_HEIGHT)    //Leave space for text of name
    //                             .attr("r", gApp.NODE_CIRCLE_SIZE)
    //                             .attr("class", "q" + (state.index) + '-' + gApp.numStates[modelNum]);
    //                         colourBox.append("text")
    //                             .attr("dx", gApp.NODE_CIRCLE_SIZE+2)
    //                             .attr("dy", gApp.NODE_CIRCLE_SIZE/2)
    //                             .attr("x",0)
    //                             .attr("y",state.index * gApp.MIN_ROW_HEIGHT)
    //                             .attr("text-anchor", 'start')
    //                             .text(state.get('Name'));
    //                     ***REMOVED***);
    //                     gApp.stateStores.push(stateStore);
    //                 ***REMOVED***,
    //                 failure: function(error) ***REMOVED***
    //                     console.log('Failed to load State info for type');
    //                 ***REMOVED***
    //             ***REMOVED***);
            
    //        colours.attr("visibility","hidden");    //Render, but mask it. Use "visible" to show again
    //     ***REMOVED***,
    
        _nodes: [],
        loadAppData: function()***REMOVED***
            gApp._nodes = [];
            var artifactData = gApp.down('#itemSelector').getRecord();
            console.log('artifactData',artifactData);
            if (!artifactData)***REMOVED***
                artifactData = gApp.down('#itemSelector').valueModels; //this is empty..?
            ***REMOVED*** else ***REMOVED***
                artifactData = [artifactData];
            ***REMOVED***
            console.log('artifactData',artifactData);
            
            if (artifactData && (artifactData.length > 1)) ***REMOVED***
                gApp._nodes.push(***REMOVED***'Name': 'Combined View',
                        'record': ***REMOVED***
                            'data': ***REMOVED***
                                '_ref': 'root',
                                'Name': ''
                            ***REMOVED***
                        ***REMOVED***,
                        'local':true
                    ***REMOVED***);
            ***REMOVED***
            console.log('artifactData',artifactData)
            
            gApp.loadArtifacts(artifactData).then(***REMOVED***
                success: gApp.redrawTree,
                failure: gApp.showError,
                scope: this 
            ***REMOVED***);
        ***REMOVED***,
        showError: function(msg)***REMOVED***
            console.log('error',msg);
        ***REMOVED***,
        onSettingsUpdate: function() ***REMOVED***
            gApp.loadAppData();
        ***REMOVED***,
    
        onTimeboxScopeChange: function(newTimebox) ***REMOVED***
            this.callParent(arguments);
            gApp.timeboxScope = newTimebox;
            gApp.loadAppData();
        ***REMOVED***,
    
        _onFilterChange: function(inlineFilterButton)***REMOVED***
            gApp.advFilters = inlineFilterButton.getTypesAndFilters().filters;
            inlineFilterButton._previousTypesAndFilters = inlineFilterButton.getTypesAndFilters();
            gApp.loadAppData();
        ***REMOVED***,
    
        _onFilterReady: function(inlineFilterPanel) ***REMOVED***
            gApp.down('#filterBox').add(inlineFilterPanel);
        ***REMOVED***,
    
        portfolioItemSelected: function(piTypeSelector) ***REMOVED***
            console.log('selector',piTypeSelector.getRecord());
            var model = piTypeSelector.getRecord().get('TypePath');
            var hdrBox = gApp.down('#headerBox');
            var portfolioFilters = Rally.data.wsapi.Filter.fromQueryString("((LeafStoryCount > 0) AND (State.Name != \"Done\"))");
            //gApp._typeStore = ptype.store;
            var selector = gApp.down('#itemSelector');
            if ( selector) ***REMOVED***
                selector.destroy();
            ***REMOVED***
            var is = hdrBox.insert(2,***REMOVED***
                xtype: 'rallyartifactsearchcombobox',
                fieldLabel: 'Choose Start Item :',
                itemId: 'itemSelector',
                multiSelect: gApp.getSetting('allowMultiSelect'),
                labelWidth: 100,
                queryMode: 'remote',
                allowNoEntry: false,
                pageSize: 200,
                width: 600,
                margin: '10 0 5 20',
                stateful: true,
                stateId: this.getContext().getScopedStateId('itemSelector'),
                storeConfig: ***REMOVED***
                    models: [model],
                    fetch: gApp.STORE_FETCH_FIELD_LIST,
                    context: gApp.getContext().getDataContext(),
                    pageSize: 200,
                    filters: portfolioFilters,
                    autoLoad: true
                ***REMOVED***,
                listeners: ***REMOVED***
                    change: gApp.loadAppData,
                    scope: this 
                ***REMOVED***
            ***REMOVED***);   
    
    //        Ext.util.Observable.capture( is, function(event) ***REMOVED*** console.log('event', event, arguments);***REMOVED***);
    //         if(gApp.getSetting('showFilter') && !gApp.down('#inlineFilter'))***REMOVED***
    //             hdrBox.add(***REMOVED***
    //                 xtype: 'rallyinlinefiltercontrol',
    //                 name: 'inlineFilter',
    //                 itemId: 'inlineFilter',
    //                 margin: '10 0 5 20',                           
    //                 context: this.getContext(),
    //                 height:26,
    //                 inlineFilterButtonConfig: ***REMOVED***
    //                     stateful: true,
    //                     stateId: this.getContext().getScopedStateId('inline-filter'),
    //                     context: this.getContext(),
    // //                    modelNames: ['PortfolioItem/' + ptype.rawValue], //NOOOO!
    //                     modelNames: gApp._getModelFromOrd(0), //We actually want to filter the features... YESSSS!
    //                     filterChildren: false,
    //                     inlineFilterPanelConfig: ***REMOVED***
    //                         quickFilterPanelConfig: ***REMOVED***
    //                             defaultFields: ['ArtifactSearch', 'Owner']
    //                         ***REMOVED***
    //                     ***REMOVED***,
    //                     listeners: ***REMOVED***
    //                         inlinefilterchange: this._onFilterChange,
    //                         inlinefilterready: this._onFilterReady,
    //                         scope: this
    //                     ***REMOVED*** 
    //                 ***REMOVED***
    //             ***REMOVED***);
    //         ***REMOVED***
    
            // if (!gApp.getSetting('useColour')) ***REMOVED***
            //     var buttonTxt = "Colour Codes";
            //     if (!gApp.down('#colourButton'))***REMOVED***
            //         hdrBox.add(***REMOVED***
            //             xtype: 'rallybutton',
            //             itemId: 'colourButton',
            //             margin: '10 0 5 20',
            //             ticked: false,
            //             text: buttonTxt,
            //             handler: function() ***REMOVED***
            //                 if (this.ticked === false) ***REMOVED***
            //                     this.setText('Return');
            //                     this.ticked = true;
            //                     d3.select("#colourLegend").attr("visibility","visible");
            //                     d3.select("#tree").attr("visibility", "hidden");
            //                 ***REMOVED*** else ***REMOVED***
            //                     this.setText(buttonTxt);
            //                     this.ticked = false;
            //                     d3.select("#colourLegend").attr("visibility","hidden");
            //                     d3.select("#tree").attr("visibility", "visible");
            //                 ***REMOVED***
            //             ***REMOVED***
            //         ***REMOVED***);
            //     ***REMOVED***
            // ***REMOVED***
    
            // if (!gApp.down('#infoButton'))***REMOVED***
            //         hdrBox.add( ***REMOVED***
            //         xtype: 'rallybutton',
            //         itemId: 'infoButton',
            //         margin: '10 0 5 20',
            //         align: 'right',
            //         text: 'Page Info',
            //         handler: function() ***REMOVED***
            //             Ext.create('Rally.ui.dialog.Dialog', ***REMOVED***
            //                 autoShow: true,
            //                 draggable: true,
            //                 closable: true,
            //                 width: 500,
            //                 autoScroll: true,
            //                 maxHeight: 600,
            //                 title: 'Information about this app',
            //                 items: ***REMOVED***
            //                     xtype: 'component',
            //                     html: 
            //                         '<p class="boldText">Hierarchical Tree View</p>' +
            //                         '<p>This app will find all the children of a particular Portfolio artefact. You can choose the type of artefact,' +
            //                         ' then the top level artefact itself.</p>' +
            //                         '<p>The colours of the circles indicate the state of progress from red (those that are not started), through to' +
            //                         ' blue (in their final stages). Click on the "Colour Codes" button to see the colour to state mapping for each' +
            //                         ' portfolio item type.</p>' +
            //                         '<p class="boldText">Choosing collections</p>' +
            //                         '<p>The app settings contains an option to allow you to multi-select the top level artefacts. This allows you to' +
            //                         ' choose a number of portfolio items of interest and then filter for the features</p>' +
            //                         '<p class="boldText">Visualising Dependencies</p>' +
            //                         '<p>The edge of the circle will be red if there are any dependencies (predecessors or successors) and the colour ' +
            //                         'of the associated text will indicate those with predecessors (red text) and those with successors (green text). ' +
            //                         'Those with both will appear as having predecessors</p>' +
            //                         '<p>If the text is blinking, it means that the relevant dependency is not being shown in this data set. </p>' +
            //                         '<p class="boldText">Exploring the data</p><p>You can investigate dependencies by using &lt;shift&gt;-Click ' +
            //                         'on the circle. This will call up an overlay with the relevant dependencies. Clicking on the FormattedID on any' +
            //                         ' artefact in the overlay will take you to it in either the EDP or QDP page (whichever you have enabled for your' +
            //                         ' session )</p>' +
            //                         '<p>If you click on the circle without using shift, then a data panel will appear containing more information about that artefact</p>' +
            //                         '<p class="boldText">Filtering</p>' +
            //                         '<p>There are app settings to enable the extra filtering capabilities on the main page, so that you can choose which lowest-level portfolio items to see' +
            //                         ' e.g. filter on Owner, Investment Type, etc. </p><p>To filter by release (e.g. to find all those features scheduled into a Program Increment)' +
            //                         ' you will need to edit the Page settings (not the App Settings) to add a Release or Milestone filter</p>' +
            //                         '<p>Source code available here: <br/><a href=https://github.com/nikantonelli/PortfolioItem-Tree-With-Dependencies> Github Repo</a></p>',
            //                     padding: 10
            //                 ***REMOVED***
            //             ***REMOVED***);
            //         ***REMOVED***
            //     ***REMOVED*** );
            // ***REMOVED***
        ***REMOVED***,
    
        loadArtifacts: function(records)***REMOVED***
            console.log('loadArtifacts',records);
            var deferred = Ext.create('Deft.Deferred');
            if (!records || records.length === 0)***REMOVED***
                deferred.resolve([]);
            ***REMOVED***
            var rootRecord = records[0];  
              
            var rootRecordLevel = this._getSelectedOrdinal(); 
            var promises = [];
            var parentProperty = "ObjectID",
                parentPropertyValue = rootRecord.get("ObjectID");
            for (var i=rootRecordLevel; i>0; i--)***REMOVED***
                parentProperty = "Parent." + parentProperty;
                var childConfig = this.getChildStoreConfig(i-1,parentProperty, parentPropertyValue);
                promises.push(this.loadWsapiRecords(childConfig));
            ***REMOVED***
            if (promises.length > 0)***REMOVED***
                Deft.Promise.all(promises).then(***REMOVED***
                    success: function(results)***REMOVED***
                        console.log('results',results)
                        var records = _.reduce(results, function(arr,result)***REMOVED*** 
                            arr = arr.concat(result); 
                            return arr;
                        ***REMOVED***,[rootRecord]);
                        console.log('records',records);
                        deferred.resolve(records);
                    ***REMOVED***,
                    failure: function(msg)***REMOVED***
                        deferred.reject(msg); 
                    ***REMOVED***,
                    scope: this 
                ***REMOVED***);
            ***REMOVED*** else ***REMOVED***
                deferred.resolve([]);
            ***REMOVED***
            return deferred.promise; 
        ***REMOVED***,
        loadWsapiRecords: function(config)***REMOVED***
            config = config || ***REMOVED******REMOVED***;
            config.pageSize = config.pageSize || 2000;
            config.limit = config.limit || Infinity; 

            var deferred = Ext.create('Deft.Deferred');

            Ext.create('Rally.data.wsapi.Store',config).load(***REMOVED***
                callback: function(records, operation,success)***REMOVED***
                    if (success)***REMOVED***
                        deferred.resolve(records);
                    ***REMOVED*** else ***REMOVED***
                        deferred.reject(operation && operation.error && operation.errors && operation.errors.length > 0 || operation.errors.join(", ") || "Error loading child records for " + config.model);
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***);
            return deferred.promise; 
        ***REMOVED***,
        getPortfolioModel: function(piLevel)***REMOVED***
            //TODO
            console.log('portfolioItemTypes',this.portfolioItemTypes,piLevel);
            return "PortfolioItem/Feature";
        ***REMOVED***,
        getChildStoreConfig: function(piLevel, parentProperty, parentPropertyValue)***REMOVED***
            console.log('levelsAbove',parentProperty, piLevel);
            var childModel = this._getModelFromOrd(piLevel);
            console.log('childModel',childModel)
            var config = ***REMOVED***
                model: childModel,
                fetch: this.STORE_FETCH_FIELD_LIST,
                filters: [],
                sorters: [
                    ***REMOVED***
                        property: 'DragAndDropRank',
                        direction: 'ASC'
                    ***REMOVED***
                ]
            ***REMOVED***;
            config.filters.push(***REMOVED***
                property: parentProperty,
                value: parentPropertyValue
            ***REMOVED***);
            if (gApp.getSetting('hideArchived')) ***REMOVED***
                config.filters.push(***REMOVED***
                    property: 'Archived',
                    operator: '=',
                    value: false
                ***REMOVED***);
            ***REMOVED***
            if(piLevel===0 && gApp.getSetting('showFilter') && gApp.advFilters && gApp.advFilters.length > 0)***REMOVED***
                Ext.Array.each(gApp.advFilters,function(filter)***REMOVED***
                    config.filters.push(filter);
                ***REMOVED***);
            ***REMOVED***
            return config; 
        ***REMOVED***,
        _getArtifacts: function(data) ***REMOVED***
            //On re-entry send an event to redraw
            if (data.length > 0)***REMOVED***
                return this.loadArtifacts(data[0]);
            ***REMOVED***
            return [];  //this.loadArtifacts(data);
            // if (data.length === 0) ***REMOVED*** return; ***REMOVED***
            
            // gApp._nodes = gApp._nodes.concat( gApp._createNodes(data));    //Add what we started with to the node list
            // console.log('recurse')
            // this.fireEvent('redrawTree');
            // console.log('_getArtifacts after node?')
            // //Starting with highest selected by the combobox, go down
    
            // _.each(data, function(record) ***REMOVED***
            //     if (record.get('Children'))***REMOVED***                                //Limit this to feature level and not beyond.
            //         collectionConfig = ***REMOVED***
            //             sorters: [
            //                 ***REMOVED***
            //                     property: 'DragAndDropRank',
            //                     direction: 'ASC'
            //                 ***REMOVED***
            //             ],
            //             fetch: gApp.STORE_FETCH_FIELD_LIST,
            //             callback: function(records, operation, success) ***REMOVED***
            //                 //Start the recursive trawl down through the levels
            //                 if (success && records && records.length)  gApp._getArtifacts(records);
            //             ***REMOVED***,
            //             filters: []
            //         ***REMOVED***;
            //         if (gApp.getSetting('hideArchived')) ***REMOVED***
            //             collectionConfig.filters.push(***REMOVED***
            //                 property: 'Archived',
            //                 operator: '=',
            //                 value: false
            //             ***REMOVED***);
            //         ***REMOVED***
    
            //         if (record.get('PortfolioItemType').Ordinal < 2) ***REMOVED*** //Only for lowest level item type)
            //             if(gApp.getSetting('showFilter') && gApp.advFilters && gApp.advFilters.length > 0)***REMOVED***
            //                 Ext.Array.each(gApp.advFilters,function(filter)***REMOVED***
            //                     collectionConfig.filters.push(filter);
            //                 ***REMOVED***);
            //             ***REMOVED***
    
            //             //Can only do releases and milestones, not interations
            //             if((gApp.timeboxScope && gApp.timeboxScope.type.toLowerCase() === 'release') ||
            //             (gApp.timeboxScope && gApp.timeboxScope.type.toLowerCase() === 'milestone') 
            //             )
            //             ***REMOVED***
            //                 collectionConfig.filters.push(gApp.timeboxScope.getQueryFilter());
            //             ***REMOVED***
            //         ***REMOVED***
            //         record.getCollection( 'Children').load( collectionConfig );
            //     ***REMOVED***
            // ***REMOVED***);
        ***REMOVED***,
    
        // _createNodes: function(data) ***REMOVED***
        //     //These need to be sorted into a hierarchy based on what we have. We are going to add 'other' nodes later
        //     var nodes = [];
        //     //Push them into an array we can reconfigure
        //     _.each(data, function(record) ***REMOVED***
        //         var localNode = (gApp.getContext().getProjectRef() === record.get('Project')._ref);
        //         nodes.push(***REMOVED***'Name': record.get('FormattedID'), 'record': record, 'local': localNode, 'dependencies': []***REMOVED***);
        //     ***REMOVED***);
        //     return nodes;
        // ***REMOVED***,
    
        _findNode: function(nodes, recordData) ***REMOVED***
            var returnNode = null;
                _.each(nodes, function(node) ***REMOVED***
                    if (node.record && (node.record.data._ref === recordData._ref))***REMOVED***
                         returnNode = node;
                    ***REMOVED***
                ***REMOVED***);
            return returnNode;
    
        ***REMOVED***,
        _findParentType: function(record) ***REMOVED***
            //The only source of truth for the hierachy of types is the typeStore using 'Ordinal'
            var ord = null;
            for ( var i = 0;  i < this.portfolioItemTypes.length; i++ )
            ***REMOVED***
                if (record.data._type === this.portfolioItemTypes[i].get('TypePath').toLowerCase()) ***REMOVED***
                    ord = this.portfolioItemTypes[i].get('Ordinal');
                    break;
                ***REMOVED***
            ***REMOVED***
            ord += 1;   //We want the next one up, if beyond the list, set type to root
            //If we fail this, then this code is wrong!
            if ( i >= this.portfolioItemTypes.length) ***REMOVED***
                return null;
            ***REMOVED***
            var typeRecord =  _.find(  this.portfolioItemTypes, function(type) ***REMOVED*** return type.get('Ordinal') === ord;***REMOVED***);
            return (typeRecord && typeRecord.get('TypePath').toLowerCase());
        ***REMOVED***,
        _findNodeById: function(nodes, id) ***REMOVED***
            return _.find(nodes, function(node) ***REMOVED***
                return node.record.data._ref === id;
            ***REMOVED***);
        ***REMOVED***,
        _findParentNode: function(nodes, child)***REMOVED***
            if (child.record.data._ref === 'root') return null;
            var parent = child.record.data.Parent;
            var pParent = null;
            if (parent )***REMOVED***
                //Check if parent already in the node list. If so, make this one a child of that one
                //Will return a parent, or null if not found
                pParent = gApp._findNode(nodes, parent);
            ***REMOVED***
            else ***REMOVED***
                //Here, there is no parent set, so attach to the 'null' parent.
                var pt = gApp._findParentType(child.record);
                //If we are at the top, we will allow d3 to make a root node by returning null
                //If we have a parent type, we will try to return the null parent for this type.
                if (pt) ***REMOVED***
                    var parentName = '/' + pt + '/null';
                    pParent = gApp._findNodeById(nodes, parentName);
                ***REMOVED***
            ***REMOVED***
            //If the record is a type at the top level, then we must return something to indicate 'root'
            return pParent?pParent: gApp._findNodeById(nodes, 'root');
        ***REMOVED***,
            //Routines to manipulate the types
    
        _getSelectedOrdinal: function() ***REMOVED***
            return gApp.down('#piType').lastSelection[0].get('Ordinal');
        ***REMOVED***,
    
         _getTypeList: function(highestOrdinal) ***REMOVED***
            var piModels = [];
            _.each(this.portfolioItemTypes, function(type) ***REMOVED***
                //Only push types below that selected
                if (type.data.Ordinal <= (highestOrdinal ? highestOrdinal: 0) )
                    piModels.push(***REMOVED*** 'type': type.data.TypePath.toLowerCase(), 'Name': type.data.Name, 'ref': type.data._ref, 'Ordinal': type.data.Ordinal***REMOVED***);
            ***REMOVED***);
            return piModels;
        ***REMOVED***,
    
        _highestOrdinal: function() ***REMOVED***
            return _.max(this.portfolioItemTypes, function(type) ***REMOVED*** return type.get('Ordinal'); ***REMOVED***).get('Ordinal');
        ***REMOVED***,
        _getModelFromOrd: function(number)***REMOVED***
            var model = null;
            _.each(this.portfolioItemTypes, function(type) ***REMOVED*** if (number == type.get('Ordinal')) ***REMOVED*** model = type; ***REMOVED*** ***REMOVED***);
            return model && model.get('TypePath');
        ***REMOVED***,
    
        // _getOrdFromModel: function(modelName)***REMOVED***
        //     var model = null;
        //     console.log(this.portfolioItemTypes)
        //     _.each(this.portfolioItemTypes, function(type) ***REMOVED***
        //         if (modelName == type.get('TypePath').toLowerCase()) ***REMOVED***
        //             model = type.get('Ordinal');
        //         ***REMOVED***
        //     ***REMOVED***);
        //     return model;
        // ***REMOVED***,
    
        _createTree: function (records) ***REMOVED***
            //Try to use d3.stratify to create nodet
            var nodes = [],
                currentProjectRef = gApp.getContext().getProjectRef();
            for (var i=0; i<records.length; i++)***REMOVED***
                nodes.push(***REMOVED***
                    Name: records[i].get('FormattedID'),
                    record: records[i],
                    localNode: currentProjectRef === records[i].get('Project')._ref,
                    dependencies: []
                ***REMOVED***);
            ***REMOVED***
            gApp._nodes = nodes; 

            var nodetree = d3.stratify()
                        .id( function(d) ***REMOVED***
                            var retval = (d.record && d.record.data._ref) || null; //No record is an error in the code, try to barf somewhere if that is the case
                            return retval;
                        ***REMOVED***)
                        .parentId( function(d) ***REMOVED***
                            //return d.record && d.record.data.Parent && d.record.data.Parent._ref || null;
                            var pParent = gApp._findParentNode(nodes, d);
                            return (pParent && pParent.record && pParent.record.data._ref); 
                        ***REMOVED***)
                        (nodes);
            return nodetree;
        ***REMOVED***,

    
        launch: function() ***REMOVED***
            gApp = this;
            Deft.Promise.all([
                this._loadPreliminaryEstimateValues(),
                this._loadPortfolioItemTypes()
            ]).then(***REMOVED***
                success: function(results)***REMOVED***
                    this.preliminaryEstimateValues = results[0];
                    this.portfolioItemTypes = results[1];
                    this._buildApp();

                ***REMOVED***,
                failure: function(msg)***REMOVED***
                    Rally.notify.Notifier.showError(***REMOVED***message: msg***REMOVED***);
                ***REMOVED***,
                scope: this 
            ***REMOVED***);
            //this.on('redrawTree', this.redrawTree);
        ***REMOVED***,
        _buildApp: function()***REMOVED***
            this.removeAll();

            var hdrBox = this.add(***REMOVED***
                xtype: 'container',
                itemId: 'headerBox',
                layout: 'hbox',
                items: [
                    
                    ***REMOVED***
                        xtype:  'rallyportfolioitemtypecombobox',
                        itemId: 'piType',
                        fieldLabel: 'Choose Portfolio Type :',
                        labelWidth: 100,
                        margin: '5 0 5 20',
                        defaultSelectionPosition: 'first',
                        storeConfig: ***REMOVED***
                            filters: [
                                ***REMOVED***
                                    property: 'Parent.Name',
                                    operator: '=',
                                    value: 'Portfolio Item'
                                ***REMOVED***,
                                ***REMOVED***
                                    property: 'Creatable',
                                    operator: '=',
                                    value: 'true'
                                ***REMOVED***,
                                ***REMOVED***
                                    property: 'Ordinal',
                                    operator: '!=',
                                    value: 0
                                ***REMOVED***
                            ]
                        ***REMOVED***,
                        
                    listeners: ***REMOVED***
                            select: this.portfolioItemSelected,    //Jump off here to add portfolio size selector
                            scope: this 
                        ***REMOVED***
                    ***REMOVED***,
                ]               
            ***REMOVED***);

            // hdrBox.add(
            //     ***REMOVED***  
            //         xtype: 'container',
            //         itemId: 'filterBox',
            //         cls: 'xxfilterbox'
            //     ***REMOVED***);

            this.add(***REMOVED***
                xtype: 'container',
                itemId: 'treeContainer'
            ***REMOVED***);
                // this.add(***REMOVED***
                //     xtype: 'portfolioitemtree',
                //     itemId: 'rootSurface',
                //     margin: '5 5 5 5',
                //     //layout: 'auto',
                //     title: 'Loading...',
                //     autoEl: ***REMOVED***
                //         tag: 'svg'
                //     ***REMOVED***,
                //     visible: false
                // ***REMOVED***);

            this.timeboxScope = this.getContext().getTimeboxScope(); 
            //Add any useful selectors into this container ( which is inserted before the rootSurface )
            //Choose a point when all are 'ready' to jump off into the rest of the app
        ***REMOVED***,
        _loadPreliminaryEstimateValues : function() ***REMOVED***
            
            console.log("_loadPreliminaryEstimateValues");
            var deferred = Ext.create('Deft.Deferred');
    
            this.loadWsapiRecords(***REMOVED***
                model: 'PreliminaryEstimate',
                fetch: true, 
                filters: []
            ***REMOVED***).then(***REMOVED***
                success : function(records) ***REMOVED***
                    deferred.resolve(records);
                ***REMOVED***
            ***REMOVED***);
            
            return deferred.promise;
        ***REMOVED***,	
    
        _loadPortfolioItemTypes : function() ***REMOVED***
            console.log("_loadPortfolioItemTypes");
            var deferred = Ext.create('Deft.Deferred');
            this.loadWsapiRecords(***REMOVED***
                model: 'TypeDefinition',
                fetch: true, 
                filters: [ ***REMOVED*** property:"Ordinal", operator:"!=", value: -1***REMOVED*** ]
            ***REMOVED***).then(***REMOVED***
                success : function(records) ***REMOVED***
                    deferred.resolve(records);
                ***REMOVED***
            ***REMOVED***);
            return deferred.promise;

        ***REMOVED***,
        getSettingsFields: function() ***REMOVED***
            console.log('getSettingsFields')
            var returned = [
            ***REMOVED***
                name: 'keepTypesAligned',
                xtype: 'rallycheckboxfield',
                fieldLabel: 'Columnised Types',
                labelAlign: 'top'
            ***REMOVED***,
            ***REMOVED***
                name: 'hideArchived',
                xtype: 'rallycheckboxfield',
                fieldLabel: 'Hide Archived',
                labelAlign: 'top'
            ***REMOVED***,
            ***REMOVED***
                name: 'showExtraText',
                xtype: 'rallycheckboxfield',
                fieldLabel: 'Add Preliminary Estimate Size to titles',
                labelAlign: 'top'
            ***REMOVED***,
            // ***REMOVED***
            //     name: 'allowMultiSelect',
            //     xtype: 'rallycheckboxfield',
            //     fieldLabel: 'Enable multiple start items (Note: Page Reload required if you change value)',
            //     labelAlign: 'top'
            // ***REMOVED***,
            ***REMOVED***
                xtype: 'rallycheckboxfield',
                fieldLabel: 'Show Advanced filter',
                name: 'showFilter',
                labelAlign: 'top'
            // ***REMOVED***,
            // ***REMOVED***
            //     xtype: 'rallycheckboxfield',
            //     fieldLabel: 'Use DisplayColor',
            //     name: 'useColour',
            //     labelAlign: 'top'
            ***REMOVED***,***REMOVED***
                xtype: 'rallycombobox',
                fieldLabel: 'Dot Color',
                labelAlign: 'right',
                name: 'colorOption',
                store: ['Implied State','Display Color','Health Color']
            ***REMOVED***
            ];
            return returned;
        ***REMOVED***
    
    ***REMOVED***);