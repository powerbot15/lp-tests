(function () {
    'use strict';
    var rwFile;
    var root;
    var clickNumber = 0;

    document.getElementById('read').addEventListener('click', function () {
        clickNumber++;
        _getFile('read');
    });

    document.getElementById('write').addEventListener('click', function () {
        clickNumber++;
        _getFile('write');
    });

    navigator.storage.getDirectory()
        .then(function (directory) {
            root = directory;
        });


    function _getFile(accessType) {
        root.getFileHandle("draft.txt", { create: true })
            .then(function (file) {
                rwFile = file;
                if(accessType === "write") {
                    _writeFile(rwFile, function () {
                    });
                } else {
                    _readFile(rwFile);
                }
            });
    }

    function _writeFile(file, callback) {
        rwFile.createWritable()
            .then(function (stream) {
                var content = JSON.stringify({number: clickNumber});
                var encoder = new TextEncoder();
                var encodedContant = encoder.encode(content);
                stream.write(encodedContant)
                    .then(function () {
                        stream.close();
                        callback();
                    });
            })
    }

    function _readFile(file) {
        file.getFile()
            .then(function (result) {
                var fileReader = new FileReader();
                fileReader.readAsArrayBuffer(result);
                fileReader.addEventListener('loadend', function () {
                    var decoder = new TextDecoder();
                    var content = decoder.decode(fileReader.result);
                    console.log(content);
                })
            })
    }
})();