const FS = require("fs");
const Maybe = mequire("core:Data.Native.Maybe:1.1.0");


const stat = fileName => {
    try {
        return Maybe.Just(FS.statSync(fileName));
    } catch (e) {
        return Maybe.Nothing;
    }
};


const exists = name =>
    FS.existsSync(name);


const fileExists = fileName =>
    stat.map(x => x.isFile).reduce(() => false)(x => x);


module.exports = {
    exists,
    fileExists,
    stat
};