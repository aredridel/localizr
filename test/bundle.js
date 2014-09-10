'use strict';

var test = require('tape'),
    path = require('path'),
    bundle = require('../lib/bundle');


test('bundle', function (t) {

    t.test('create', function (t) {
        var root, bun;

        root = path.resolve(__dirname, 'fixtures/content');
        bun = bundle.create(root);

        t.equal(typeof bun, 'object');
        t.equal(typeof bun.get, 'function');
        t.equal(typeof bun.load, 'function');
        t.equal(bun.root, root);
        t.end();
    });


    t.test('load', function (t) {
        var root, orig;

        root = path.resolve(__dirname, 'fixtures/content');

        orig = bundle.create(root);
        orig.load(function (err, bun) {
            t.error(err);
            t.strictEqual(bun, orig);
            t.equal(typeof bun, 'object');
            t.equal(typeof bun.get, 'function');
            t.equal(typeof bun.load, 'function');
            t.equal(bun.root, root);
            t.end();
        });
    });


    t.test('load noop', function (t) {
        var root, orig;

        root = path.resolve(__dirname, 'fixtures/content');

        orig = bundle.create(root);
        orig.load(function (err, bun) {

            t.error(err);
            t.strictEqual(bun, orig);

            bun.load(function (err, bun2) {
                t.error(err);
                t.strictEqual(bun2, bun);
                t.equal(typeof bun2, 'object');
                t.equal(typeof bun2.get, 'function');
                t.equal(typeof bun2.load, 'function');
                t.equal(bun2.type, 'properties');
                t.equal(bun2.name, 'index');
                t.end();
            });
        });
    });


    t.test('load err - no file', function (t) {
        bundle.create('').load(function (err, bun) {
            t.ok(err);
            t.notOk(bun);
            t.end();
        });
    });


    t.test('get', function (t) {
        var root = path.resolve(__dirname, 'fixtures/content');
        bundle.create(root).load(function (err, bun) {
            var value;

            t.error(err);

            bun.get('index.foo', {}, function (err, value) {
                t.error(err);
                t.equal(value, 'Hello, {name}!');
                t.end();
            });
        });
    });


    t.test('get namespaced', function (t) {
        var root = path.resolve(__dirname, 'fixtures/content');
        bundle.create(root).load(function (err, bun) {
            var value;

            t.error(err);

            bun.get('index.bar.baz', {}, function (err, value) {
                t.error(err);
                t.equal(value, 'Goodnight, {name}!');
                t.end();
            });
        });
    });


    t.test('get err - no load', function (t) {
        var root = path.resolve(__dirname, 'fixtures/content');
        t.throws(function () {
            bundle.create(root).get('foo');
        });
        t.end();
    });


    t.test('get missing', function (t) {
        var root = path.resolve(__dirname, 'fixtures/content');
        bundle.create(root).load(function (err, bun) {
            var value;

            t.error(err);

            bun.get('bam', {}, function (err, value) {
                t.error(err);
                t.equal(value, '☃bam☃');
                t.end();
            });
        });
    });


    t.test('get nothing', function (t) {
        var root = path.resolve(__dirname, 'fixtures/content');
        bundle.create(root).load(function (err, bun) {
            var value;

            t.error(err);

            bun.get(undefined, {}, function (err, value) {
                t.error(err);
                t.equal(value, '☃undefined☃');
                t.end();
            });
        });
    });


    t.test('isContentBundle', function (t) {
        t.ok(bundle.isContentBundle(bundle.create()));
        t.notOk(bundle.isContentBundle({}));
        t.end();
    });

});
