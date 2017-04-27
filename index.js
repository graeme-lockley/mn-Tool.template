const SyncFileSystem = mrequire("core:System.IO.Native.SyncFileSystem:1.0.0");
const Translate = require("./Tool/Template/Translate");


function compile(sourceName, targetName) {
    return SyncFileSystem.readFile(sourceName)
        .andThen(content => Translate(content))
        .andThen(content => SyncFileSystem.writeFile(targetName)(content));
}


module.exports = compile;
