"object" != typeof ConverterForm && (ConverterForm = {}),
    function() {
        "use strict";
        "string" != typeof ConverterForm._undefMsg && (ConverterForm._undefMsg = "Some words you have entered cannot be found in the IPA dictionary."), "string" != typeof ConverterForm._multiMsg && (ConverterForm._multiMsg = "Some words you have entered have multiple pronunciations in english. Only the first pronunciation is shown"), "function" != typeof ConverterForm._updateParagraph && (ConverterForm._updateParagraph = function(e, o) {
            document.getElementById(e).innerHTML = "<p>" + o + "</p>"
        }), "function" != typeof ConverterForm._updateTextArea && (ConverterForm._updateTextArea = function(e, o) {
            document.getElementById(e).value = o
        }), "function" != typeof ConverterForm.convert && (ConverterForm.convert = function(e, o, r) {
            if ("string" != typeof e) console.log('TextToIPA Error: "inID" called in "ConverterForm.convert()" is not a valid ID"');
            else if ("object" != typeof TextToIPA) console.log('TextToIPA Error: "TextToIPA" object not found. Is "text-to-ipa.js" included before ConverterForm.convert() is ran?');
            else {
                var t = "",
                    n = "",
                    i = [],
                    s = document.getElementById(e).value.split(/\s+/g);
                for (var u in s) {
                    var a = TextToIPA.lookup(s[u].toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, " "));
                    "undefined" == typeof a.error ? (t = ConverterForm._undefMsg, i.push(s[u])) : "multi" === a.error ? (t = ConverterForm._multiMsg, i.push(a.text)) : i.push(a.text)
                }
                i = i.join(" "), "string" == typeof o ? ConverterForm._updateTextArea(o, i) : console.log('TextToIPA Warning: "outID" in "ConverterForm.convert()" is not a string, skipping IPA output.'), "string" == typeof r ? ConverterForm._updateParagraph(r, t + " " + n) : console.log('TextToIPA Warning: "errID" in "ConverterForm.convert()" is not a string, skipping error output.')
            }
        })
    }();