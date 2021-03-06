"object" != typeof ConverterFormDict && (ConverterFormDict = {}),
    function() {
        "use strict";
        "string" != typeof ConverterFormDict._undefMsg && (ConverterFormDict._undefMsg = "Some words you have entered cannot be found in the IPA dictionary."), "string" != typeof ConverterFormDict._multiMsg && (ConverterFormDict._multiMsg = "Some words you have entered have multiple pronunciations in english. Only the first pronunciation is shown"), "function" != typeof ConverterFormDict._updateParagraph && (ConverterFormDict._updateParagraph = function(e, o) {
            document.getElementById(e).innerHTML = "<p>" + o + "</p>"
        }), "function" != typeof ConverterFormDict._updateTextArea && (ConverterFormDict._updateTextArea = function(e, o) {
            document.getElementById(e).value = o
        }), "function" != typeof ConverterFormDict.convert && (ConverterFormDict.convert = function(e, o, r) {
            if ("string" != typeof e) console.log('TextToIPADict Error: "inID" called in "ConverterFormDict.convert()" is not a valid ID"');
            else if ("object" != typeof TextToIPADict) console.log('TextToIPADict Error: "TextToIPADict" object not found. Is "text-to-ipa.js" included before ConverterFormDict.convert() is ran?');
            else {
                var t = "",
                    n = "",
                    i = [],
                    s = document.getElementById(e).value.split(/\s+/g);
                for (var u in s) {
                    var a = TextToIPADict.lookup(s[u].toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, " "));
                    "undefined" == typeof a.error ? (t = ConverterFormDict._undefMsg, i.push(s[u])) : "multi" === a.error ? (t = ConverterFormDict._multiMsg, i.push(a.text)) : i.push(a.text)
                }
                i = i.join(" "), "string" == typeof o ? ConverterFormDict._updateTextArea(o, i) : console.log('TextToIPADict Warning: "outID" in "ConverterFormDict.convert()" is not a string, skipping IPA output.'), "string" == typeof r ? ConverterFormDict._updateParagraph(r, t + " " + n) : console.log('TextToIPADict Warning: "errID" in "ConverterFormDict.convert()" is not a string, skipping error output.')
            }
        })
    }();