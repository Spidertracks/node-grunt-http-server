"use strict";

var _ = require("lodash"),
    fs = require('fs'),
    path = require('path'),
    Divhide = require("divhide");

/**
 *
 * Creates a customPages middleware which serve the a custom url with
 * the content of the given file.
 *
 * @param {String} basePath
 * @param {Object} rules
 *
 */
var CustomPagesMiddleware = function(basePath, rules){

    basePath = Divhide.Safe.string(basePath);
    rules = Divhide.Safe.object(rules);

    return function(req, res){
        var url = req.url;
        var relFilePath = Divhide.Safe.string(rules[url]);

        // ignore if no rule is defined
        if(!relFilePath){
            res.emit("next");
            return;
        }

        var filePath = path.normalize(basePath + "/" + relFilePath);
        fs.readFile(filePath, "utf8", function(err, data){

            var fileContent = data;
            if (err){
                fileContent = err.toString();
            }

            res.setHeader('Content-Type', 'text/html');
            res.end(fileContent);

        });
    }

};

module.exports = CustomPagesMiddleware;
