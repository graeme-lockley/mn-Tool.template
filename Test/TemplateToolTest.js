const Assert = require("assert");
const FileSystem = mrequire("core:System.IO.Native.FileSystem:1.1.0");
const Result = mrequire("core:Data.Result:1.0.0");
const Unit = mrequire("core:Test.Unit:v1.0.0");


const Use = require("../index.js");
const Translate = require("../Tool/Template/Translate");


const suite = Unit.newSuite("Text Template Suite");


Promise.all([
    FileSystem.readFile(__dirname + "/TemplateToolData/0001.input.txt"),
    FileSystem.readFile(__dirname + "/TemplateToolData/0001.output.txt")
]).then(output => {
    suite.case("simple template translation", () => {
        Assert.deepEqual(Translate(output[0]), Result.Okay(output[1]));
    });
});


FileSystem.readFile(__dirname + "/TemplateToolData/0002.output.txt")
    .then(output => {
        suite.case("given a template name then when the template is used it produces the expected result", () => {
            const use = Use(__dirname + "/TemplateToolData/0002.input.template")(__dirname + "/TemplateToolData/0002.input.js");
            const template = require(__dirname + "/TemplateToolData/0002.input.js");

            Assert.equal(use.isOkay(), true);
            Assert.deepEqual(template("FieldA")("FieldB"), output);
        });
    });
