#!/bin/env node

var fs = require('fs');
var http = require('http');
var request = require('request');
var tidy = require('htmltidy2');
var xmlserializer = require('xmlserializer');

var html2xhtml = function(htmlString) {
    var parser = require('parse5');
    dom = parser.parse(htmlString);
    return xmlserializer.serializeToString(dom).replace('xmlns="http://www.w3.org/1999/xhtml"', '');
};

var getData = function(dataUrl, xsltString, callback) {
    
    var libxslt = require('libxslt');
    libxslt.parse(xsltString, function(err, stylesheet) {
        if (err) {
            console.log('failed to parse xslt');
            callback(err, null);
        } else {
            var opts = {
                doctype: 'xml',
                hideComments: true, //  multi word options can use a hyphen or "camel case"
                indent: false
            };

            var stream = request.get(dataUrl).pipe(tidy.createWorker(opts));

            var doc = ''
            stream.on('data', function(chunk) {
                var part = chunk.toString();
                doc += part;
            });

            stream.on('end', function() {

                stylesheet.apply(html2xhtml(doc), {}, function(err, result) {

                    // err contains any error from parsing the document or applying the stylesheet
                    // result is a string containing the result of the transformation

                    callback(err, result);
                });
            });
        }
    });
}

;
exports.getData = getData;
