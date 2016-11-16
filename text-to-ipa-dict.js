"object" != typeof TextToIPADict && (TextToIPADict = {}),
    function() {
        "use strict";

        function t(t, o) {
            this.error = t, this.text = o
        }
        "object" != typeof TextToIPADict._IPADict && (TextToIPADict._IPADict = {}), "function" != typeof TextToIPADict._parseDict && (TextToIPADict._parseDict = function(t) {
            console.log("TextToIPADict: Beginning parsing to dict...");
            for (var o in t) {
                var e = t[o].split(/\s+/g);
                TextToIPADict._IPADict[e[0]] = e[1]
            }
            console.log("TextToIPADict: Done parsing.")
        }), "function" != typeof TextToIPADict.loadDict && (TextToIPADict.loadDict = function(t) {
            if (console.log("TextToIPADict: Loading dict from " + t + "..."), "string" != typeof t) console.log("TextToIPADict Error: Location is not valid!");
            else {
                var o = new XMLHttpRequest;
                o.open("GET", t, !0), o.onreadystatechange = function() {
                    4 == o.readyState && (200 == o.status || 0 == o.status) && TextToIPADict._parseDict(o.responseText.split("\n"))
                }, o.send(null)
            }
        }), "function" != typeof TextToIPADict.lookup && (TextToIPADict.lookup = function(o) {
            if (0 !== Object.keys(TextToIPADict._IPADict).length) {
                if ("undefined" != typeof TextToIPADict._IPADict[o]) {
                    for (var e = null, n = TextToIPADict._IPADict[o], i = 1; 4 > i && "undefined" != typeof TextToIPADict._IPADict[o + "(" + i + ")"]; i++) e = "multi";
                    return n = n.replace(/ˈ/g, ""), console.log("replaced"), new t(e, n)
                }
                return new t("undefined", o)
            }
            console.log('TextToIPADict Error: No data in TextToIPADict._IPADict. Did "TextToIPADict.loadDict()" run?')
        })
    }();