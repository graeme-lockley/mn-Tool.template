const SyncFileSystem = mrequire("core:System.IO.Native.SyncFileSystem:1.0.0");
const NativeString = require("../../Data/Native/String");
const Result = mrequire("core:Data.Result:1.0.0");
const Template = mrequire("core:Text.Template:1.0.3");


const transformTemplate = model =>
    SyncFileSystem.readFile(__dirname + "/translate.template")
        .andThen(Template.compile)
        .andThen(t => Result.Okay(t.apply(model)));


const parseContent = content =>
    NativeString.indexOf("%%%")(content).reduce(
        () =>
            Result.Error("Error: Template does not contain a %%%"))(
        indexOfPercentages =>
            NativeString.indexOfFrom("\n")(indexOfPercentages)(content).reduce(
                () =>
                    Result.Error("Error: Template does not contain a %%% ending within a newline"))(
                indexOfNewline =>
                    Result.Okay({
                        header: NativeString.substring(0)(indexOfPercentages)(content),
                        parameters: NativeString.split(/[ \t]+/)(NativeString.trim(NativeString.substring(indexOfPercentages + 3)(indexOfNewline)(content))),
                        body: NativeString.substringFrom(indexOfNewline + 1)(content)
                    })
            )
    );


const transform = content =>
    parseContent(content)
        .andThen(transformTemplate);


module.exports = transform;