const Assert = require("assert");
const FileSystem = mrequire("core:System.IO.Native.FileSystem:1.1.0");
const Result = mrequire("core:Data.Result:1.0.0");
const Unit = mrequire("core:Test.Unit:v1.0.0");


const Use = require("../index.js");
const Translate = require("../Tool/Template/Translate");


const touch = fileName => {
    const now = new Date();

    return FileSystem.open(fileName)("r+")
        .then(fd => FileSystem.futimes(now)(now)(fd)
            .then(FileSystem.close(fd)));
};


const suite = Unit.newSuite("Text Template Suite");


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
