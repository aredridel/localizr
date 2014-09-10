'use strict';

var test = require('tape'),
    path = require('path'),
    localizr = require('../'),
    bl = require('bl');


test('localizr', function (t) {

    t.test('processing', function (t) {
        var options, dest;

        options = {
            src: path.resolve(__dirname, 'fixtures/templates/index.dust'),
            props: path.resolve(__dirname, 'fixtures/content')
        };

        dest = bl(function(err, data) {
            t.error(err);
            t.equal(data.toString().trim(), '<h1>Hello, {name}!</h1>');
            t.end();
        });

        localizr.createReadStream(options).pipe(dest);
    });


    t.test('invalid src', function (t) {
        var options;

        options = {
            src: undefined,
            props: path.resolve(__dirname, 'fixtures/content')
        };

        t.throws(function () {
            localizr.createReadStream(options);
        });

        t.end();
    });


    t.test('invalid props', function (t) {
        var options;

        options = {
            src: path.join(__dirname, 'fixtures', 'templates', 'index.dust'),
            props: undefined
        };

        t.throws(function () {
            localizr.createReadStream(options);
        });

        t.end();
    });


    t.test('invalid options', function (t) {
        t.throws(function () {
            localizr.createReadStream();
        });

        t.end();
    });


    t.test('src ENOENT', function (t) {
        var options;

        options = {
            src: path.resolve(__dirname, 'fixtures/templates/nofile.dust'),
            props: path.resolve(__dirname, 'fixtures/content')
        };

        function onerror(err) {
            t.ok(err);
            t.end();
        }

        localizr.createReadStream(options).on('error', onerror);
    });


    t.test('props ENOENT', function (t) {
        var options;

        options = {
            src: path.resolve(__dirname, 'fixtures/templates/index.dust'),
            props: path.resolve(__dirname, 'fixtures/content')
        };

        function onerror(err) {
            t.ok(err);
            t.end();
        }

        localizr.createReadStream(options).on('error', onerror);
    });

});

