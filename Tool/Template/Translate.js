const FS = require("fs");
const Result = mrequire("core:Data.Result:1.0.0");
const Template = mrequire("core:Text.Template:1.0.3");


const transformTemplate = model =>
    Template.compile(FS.readFileSync(__dirname + "/translate.template", {encoding: "utf8"}))
        .andThen(t => Result.Okay(t.apply(model)));


const parseContent = content => {
    const indexOfPercentages = content.indexOf("%%%");

    if (indexOfPercentages === -1) {
        return Result.Error("Error: Template does not contain a %%%");
    } else {
        const indexOfNewline = content.indexOf("\n", indexOfPercentages);

        if (indexOfNewline === -1) {
            return Result.Error("Error: Template does not contain a %%% ending within a newline");
        } else {
            return Result.Okay({
                header: content.substring(0, indexOfPercentages),
                parameters: content.substring(indexOfPercentages + 3, indexOfNewline).trim().split(/[ \t]+/),
                body: content.substring(indexOfNewline + 1)
            });
        }
    }
};


const transform = content =>
    parseContent(content)
        .andThen(transformTemplate);


module.exports = transform;