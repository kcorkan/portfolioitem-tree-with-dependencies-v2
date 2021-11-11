(function () ***REMOVED***
    var Ext = window.Ext4 || window.Ext;

    Ext.define("Rally.apps.DateMixin", ***REMOVED***

        dateFormatters: [
            ***REMOVED***key: "MMM", value: "%b"***REMOVED***,
            ***REMOVED***key: "MM", value: "%m"***REMOVED***,
            ***REMOVED***key: "dd", value: "%d"***REMOVED***,
            ***REMOVED***key: "yyyy", value: "%Y"***REMOVED***
        ],

        dateToStringDisplay: function (date) ***REMOVED***
            return Ext.Date.format(date, 'm/d/Y');
        ***REMOVED***,

        dateToString: function (date) ***REMOVED***
            return Ext.Date.format(date, 'Y-m-d\\TH:i:s.u\\Z');
        ***REMOVED***,

        dateStringToObject: function (dateStr) ***REMOVED***
            var finalIndex = dateStr.indexOf('T'),
                dateObj;

            if (finalIndex > -1) ***REMOVED***
                dateStr = dateStr.slice(0, dateStr.indexOf('T'));
            ***REMOVED***

            dateObj = this._splitDateParts(dateStr);

            return new Date(dateObj.year, dateObj.month, dateObj.day);
        ***REMOVED***,

        _getMonth: function(month) ***REMOVED***
            var monthMap = ***REMOVED*** jan: 0, feb: 1, mar: 2, apr: 3,
                             may: 4, jun: 5, jul: 6, aug: 7,
                             sep: 8, oct: 9, nov: 10, dec: 11 ***REMOVED***;
            if(isNaN(month)) ***REMOVED***
                try ***REMOVED***
                    month = monthMap[month.toLowerCase()];
                ***REMOVED*** catch(err) ***REMOVED*** ***REMOVED***
            ***REMOVED*** else ***REMOVED***
                month = parseInt(month, 10) - 1;
            ***REMOVED***

            return month.toString();
        ***REMOVED***,

        _objectFromYearFirstDate: function (dateArray) ***REMOVED***
            var month = 0,
                day = 0,
                year = 0;

            if (dateArray.length !== 3) ***REMOVED***
                return ***REMOVED*** year: year, month: month, day: day ***REMOVED***;
            ***REMOVED***

            year = dateArray[0];
            month = this._getMonth(dateArray[1]);
            day = dateArray[2];

            return ***REMOVED***
                year: year,
                month: month,
                day: day
            ***REMOVED***;
        ***REMOVED***,

        _objectFromMonthFirstDate: function (dateArray) ***REMOVED***
            var month = 0,
                day = 0,
                year = 0;

            if (dateArray.length !== 3) ***REMOVED***
                return ***REMOVED*** year: year, month: month, day: day ***REMOVED***;
            ***REMOVED***

            month = this._getMonth(dateArray[0]);
            day = dateArray[1];
            year = dateArray[2];

            return ***REMOVED***
                month: month,
                day: day,
                year: year
            ***REMOVED***;
        ***REMOVED***,

        _shouldSplitOnDash: function (dateStr) ***REMOVED***
            return dateStr.split('-').length === 3;
        ***REMOVED***,

        _splitDateParts: function (dateStr) ***REMOVED***
            if (this._shouldSplitOnDash(dateStr)) ***REMOVED***
                return this._objectFromYearFirstDate(dateStr.split('-'));
            ***REMOVED***
            else ***REMOVED***
                return this._objectFromMonthFirstDate(dateStr.split('/'));
            ***REMOVED***
        ***REMOVED***

    ***REMOVED***);

***REMOVED***());