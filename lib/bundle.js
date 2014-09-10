/*───────────────────────────────────────────────────────────────────────────*\
 │  Copyright (C) 2014 eBay Software Foundation                               │
 │                                                                            │
 │  Licensed under the Apache License, Version 2.0 (the "License");           │
 │  you may not use this file except in compliance with the License.          │
 │  You may obtain a copy of the License at                                   │
 │                                                                            │
 │    http://www.apache.org/licenses/LICENSE-2.0                              │
 │                                                                            │
 │  Unless required by applicable law or agreed to in writing, software       │
 │  distributed under the License is distributed on an "AS IS" BASIS,         │
 │  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  │
 │  See the License for the specific language governing permissions and       │
 │  limitations under the License.                                            │
 \*───────────────────────────────────────────────────────────────────────────*/
'use strict';

var fs = require('fs'),
    path = require('path'),
    util = require('util'),
    localebundle = require('localebundle'),
    spud = require('spud');

var missing = '☃%s☃';

var prototype = {

    get: function get(key, opts, cb) {
        if (!cb) {
            return cb(new Error("cb must be a function"));
        }
        var namespace, value;

        if (typeof key !== 'string') {
            return cb(null, util.format(missing, String(key)));
        }

        this._bundle.get(key, function (err, value) {
            if (value === undefined || value === null) {
                value = util.format(missing, key);
            }

            cb(null, value);
        });
    },

    load: function (callback) {
        var that = this;
        return process.nextTick(function () {
            callback(null, that);
        });
    }

};


exports.create = function (root) {

    var bundle = localebundle(root);

    return Object.create(prototype, {
        _bundle: {
            enumerable: false,
            writable: true,
            value: bundle
        },

        root: {
            enumerable: true,
            writable: false,
            value: root
        }
    });
};


exports.isContentBundle = function (obj) {
    return prototype.isPrototypeOf(obj);
};
