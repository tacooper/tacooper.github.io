// convert decimal number into hex padded string
var decToHex = function(dec, padding) {
    var hex = Number(dec).toString(16);
    while (hex.length < padding) {
        hex = "0" + hex;
    }
    return hex;
}
