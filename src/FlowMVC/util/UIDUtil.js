/*
 Copyright (c) 2013 [Web App Solution, Inc.](mailto:admin@webappsolution.com)

 FlowMVC is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 FlowMVC is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with FlowMVC.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Contains utilities to create unique IDs.
 */
Ext.define("FlowMVC.util.UIDUtil", {

    statics: {

        /**
         * Create and return a "version 4" RFC-4122 UUID string.
         *
         * randomUUID.js - Version 1.0
         *
         * Copyright 2008, Robert Kieffer
         *
         * This software is made available under the terms of the Open Software License
         * v3.0 (available here: http://www.opensource.org/licenses/osl-3.0.php )
         *
         * The latest version of this file can be found at:
         * http://www.broofa.com/Tools/randomUUID.js
         *
         * For more information, or to comment on this, please go to:
         * http://www.broofa.com/blog/?p=151
         *
         * @return {String} A unique ID in the form of C4A56B5B-AC4B-46FB-AE7D-BAF45154A95E.
         */
        randomUUID: function() {
            var s = [], itoh = '0123456789ABCDEF';

            // Make array of random hex digits. The UUID only has 32 digits in it, but we
            // allocate an extra items to make room for the '-'s we'll be inserting.
            for (var i = 0; i <36; i++) s[i] = Math.floor(Math.random()*0x10);

            // Conform to RFC-4122, section 4.4
            s[14] = 4;  // Set 4 high bits of time_high field to version
            s[19] = (s[19] & 0x3) | 0x8;  // Specify 2 high bits of clock sequence

            // Convert to hex chars
            for (var j = 0; j <36; j++) s[j] = itoh[s[j]];

            // Insert '-'s
            s[8] = s[13] = s[18] = s[23] = '-';
            console.log(s.join(''));

            return s.join('');
        }
    }
});

