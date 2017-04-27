const Assert = require("assert");
const FileSystem = mrequire("core:System.IO.Native.FileSystem:1.0.0");
const FS = require("fs");
const Result = mrequire("core:Data.Result:1.0.0");
const Unit = mrequire("core:Test.Unit:v1.0.0");


const Use = require("../index.js");
const Translate = require("../Tool/Template/Translate");


const suite = Unit.newSuite("Text Template Suite");


const denodeify = proc =>
    new Promise((fulfill, reject) => {
        proc((err, result) => {
            if (err) {
                reject(err);
            } else {
                fulfill(result);
            }
        });
    });


const open = fileName => options =>
    denodeify(cb => FS.open(fileName, options, cb));


const futimes = atime => mtime => fileDescriptor =>
    denodeify(cb => FS.futimes(fileDescriptor, atime, mtime, cb));


const close = fileDescriptor =>
    denodeify(cb => FS.close(fileDescriptor, cb));


const touch = fileName => {
    const now = new Date();

    return open(fileName)("r+")
        .then(fd => futimes(now)(now)(fd)
            .then(close(fd)));
};


Promise.all([
    FileSystem.readFile(__dirname + "/TemplateToolData/0001.input.txt"),
    FileSystem.readFile(__dirname + "/TemplateToolData/0001.output.txt")
]).then(output => {
    suite.case("simple template translation", () => {
        Assert.deepEqual(Translate(output[0]), Result.Okay(output[1]));
    });
});


Promise.all([
    FileSystem.readFile(__dirname + "/TemplateToolData/0002.output.txt"),
    touch(__dirname + "/TemplateToolData/0002.input.template")
]).then(output => {
    suite.case("given a template name then when the template is used it produces the expected result", () => {
        Assert.deepEqual(Use(__dirname + "/TemplateToolData/0002.input.template")("FieldA")("FieldB"), output[0]);
    });
});
