"object" != typeof TextToIPA && (TextToIPA = {}),
    function() {
        "use strict";

        function t(t, o) {
            this.error = t, this.text = o
        }
        "object" != typeof TextToIPA._IPADict && (TextToIPA._IPADict = {}), "function" != typeof TextToIPA._parseDict && (TextToIPA._parseDict = function(t) {
            console.log("TextToIPA: Beginning parsing to dict...");
            for (var o in t) {
                var e = t[o].split(/\s+/g);
                TextToIPA._IPADict[e[0]] = e[1]
            }
            console.log("TextToIPA: Done parsing.")
        }), "function" != typeof TextToIPA.loadDict && (TextToIPA.loadDict = function(t) {
            if (console.log("TextToIPA: Loading dict from " + t + "..."), "string" != typeof t) console.log("TextToIPA Error: Location is not valid!");
            else {
                var o = new XMLHttpRequest;
                o.open("GET", t, !0), o.onreadystatechange = function() {
                    4 == o.readyState && (200 == o.status || 0 == o.status) && TextToIPA._parseDict(o.responseText.split("\n"))
                }, o.send(null)
            }
        }), "function" != typeof TextToIPA.lookup && (TextToIPA.lookup = function(o) {
            if (0 !== Object.keys(TextToIPA._IPADict).length) {
                if ("undefined" != typeof TextToIPA._IPADict[o]) {
                    for (var e = null, n = TextToIPA._IPADict[o], i = 1; 4 > i && "undefined" != typeof TextToIPA._IPADict[o + "(" + i + ")"]; i++) e = "multi";
                    return n = n.replace(/ˈ/g, ""), console.log("replaced"), new t(e, n)
                }
                return new t("undefined", o)
            }
            console.log('TextToIPA Error: No data in TextToIPA._IPADict. Did "TextToIPA.loadDict()" run?')
        })
    }();