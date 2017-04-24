const Assert = require("assert");
const FileSystem = mrequire("core:System.IO.Native.FileSystem:1.0.0");
const Result = mrequire("core:Data.Result:1.0.0");
const Unit = mrequire("core:Test.Unit:v1.0.0");


const Translate = require("../Tool/Template/Translate");


const suite = Unit.newSuite("Text Template Suite");

Promise.all([
    FileSystem.readFile(__dirname + "/TemplateToolData/0001.input.txt"),
    FileSystem.readFile(__dirname + "/TemplateToolData/0001.output.txt")
]).then(output => {
    suite.case("simple template translation", () => {
        console.log("---");
        console.log(Translate(output[0]).value[1]);
        console.log("---");
        console.log(output[1]);
        console.log("---");
        Assert.deepEqual(Translate(output[0]), Result.Okay(output[1]));
    });
});
