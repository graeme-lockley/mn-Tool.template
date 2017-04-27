const SyncFileSystem = require("./System/IO/Native/SyncFileSystem");
const Translate = require("./Tool/Template/Translate");


function compile(sourceName, targetName) {
    return SyncFileSystem.readFile(sourceName)
        .andThen(content => Translate(content))
        .andThen(content => SyncFileSystem.writeFile(targetName)(content));
}


module.exports = compile;
