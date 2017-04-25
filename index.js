const Array = mrequire("core:Data.Array:v1.0.0");
const FS = require("fs");
const Maybe = mrequire("core:Data.Maybe:v1.0.0");
const SyncFileSystem = require("./System/IO/Native/SyncFileSystem");
const Path = require("path");
const Result = mrequire("core:Data.Result:1.0.0");
const Translate = require("./Tool/Template/Translate");


// For example - this is a fully qualified name WITH extension and version number.  For this tool the fileName is of the
// form:
//      XXXX.#.#.#.adt
// The #.#.# corresponds to the semantic versioning whilst the adt corresponds to this generator.
//
// On receiving this call we cannot assume anything related to the generation.  Should a generated JS file already exist
// then it should not re-generate the file.

function isDigit(ch) {
    return ch >= "0".charCodeAt(0) && ch <= "9".charCodeAt(0);
}


function extractVersion(fileName, fromIndex) {
    let lp = fromIndex;
    let startIndex = lp;

    while (true) {
        while (lp >= 0 && isDigit(fileName.charCodeAt(lp))) {
            lp -= 1;
        }

        if (lp >= 0 && fileName.charCodeAt(lp) === ".".charCodeAt(0)) {
            startIndex = lp;
            lp -= 1;
        } else {
            return fileName.substr(startIndex, fromIndex - startIndex);
        }
    }
}
assumptionEqual(extractVersion("hello.1.2.3.adt", "hello.1.2.3.adt".length - 4), ".1.2.3");
assumptionEqual(extractVersion("hello.1.3.adt", "hello.1.3.adt".length - 4), ".1.3");
assumptionEqual(extractVersion("hello.adt", "hello.adt".length - 4), "");


function splitFileName(fileName) {
    const extension = Path.extname(fileName);
    const version = extractVersion(fileName, fileName.length - extension.length);

    return Array.from([
        fileName.substr(0, fileName.length - extension.length - version.length),
        version,
        extension]);
}
assumptionEqual(splitFileName("/usr/bob/Token.1.2.3.adt"), Array.from(["/usr/bob/Token", ".1.2.3", ".adt"]));
assumptionEqual(splitFileName("/usr/bob/Token.1.adt"), Array.from(["/usr/bob/Token", ".1", ".adt"]));
assumptionEqual(splitFileName("/usr/bob/Token.adt"), Array.from(["/usr/bob/Token", "", ".adt"]));
assumptionEqual(splitFileName("/usr/bob/Token.1.2.3.4.adt"), Array.from(["/usr/bob/Token", ".1.2.3.4", ".adt"]));
assumptionEqual(splitFileName("/usr/bob/Token"), Array.from(["/usr/bob/Token", "", ""]));


function compile(sourceName, targetName) {
    console.log(`Compiling ${sourceName} using template`);

    return SyncFileSystem.readFile(sourceName)
        .andThen(content => Translate(content))
        .andThen(content => SyncFileSystem.writeFile(targetName, content));
}


function use(fileName) {
    const fullFileName = Path.isAbsolute(fileName) ? fileName : Path.join(process.cwd(), fileName);
    const splitName = splitFileName(fullFileName);
    const targetName = splitName.at(0).withDefault("") + ".js";


    const modificationDate = fileName =>
        SyncFileSystem.stat(fileName).map(s => s.mtime);


    const hasTarget = () =>
        SyncFileSystem.fileExists(targetName);


    function targetOlderThanSource() {
        const sourceDateTime = modificationDate(fullFileName);
        const targetDateTime = modificationDate(targetName);

        return sourceDateTime.map(t => t.getTime()).withDefault(0) >= targetDateTime.map(t => t.getTime()).withDefault(0);
    }

    if (!hasTarget() || targetOlderThanSource()) {
        const result = compile(fullFileName, targetName);
        if (result.isError()) {
            throw new Error(result.toString());
        }
    }

    return require(targetName);
}


module.exports = use;
