const FS = require("fs");
const Result = mrequire("core:Data.Result:1.0.0");
const Template = mrequire("core:Text.Template:1.0.3");

const extractRE = /([^~]*)--(.*\n)(.*)$/m;


const transformTemplate = model =>
    Template.compile(FS.readFileSync(__dirname + "/translate.template", {encoding: "utf8"}))
        .andThen(t => Result.Okay(t.apply(model)));


const transform = content => {
    const parseContent = extractRE.exec(content);

    if (parseContent) {
        const data = {
            header: parseContent[1],
            parameters: parseContent[2].trim().split(/[ \t]+/),
            body: parseContent[3]
        };

        return transformTemplate(data);
    } else {
        return Result.Error("Unable to parse the content");
    }
};


module.exports = transform;