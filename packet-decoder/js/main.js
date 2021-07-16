// run when page is ready
$(function () {
    // display version number
    var $versionSpan = $("#version-span");
    $versionSpan.text("Version: " + VERSION_NUMBER);

    // configure callback for clicking hex format button
    var $hexFormatButton = $("#hex-format-button");
    $hexFormatButton.click(function() {
        // deselect other format button
        selectButton($binFormatButton, false);

        // select this button
        selectButton($(this), true);

        // force sanitizing raw packet for hex format
        $rawPacketInput.change();
    });

    // configure callback for clicking binary format button
    var $binFormatButton = $("#bin-format-button");
    $binFormatButton.click(function() {
        // deselect other format button
        selectButton($hexFormatButton, false);

        // select this button
        selectButton($(this), true);

        // force sanitizing raw packet for binary format
        $rawPacketInput.change();
    });

    // configure callback for clicking decode button
    var $decodeButton = $("#decode-button");
    $decodeButton.click(function() {
        // decode raw packet according to packet schema
        var message;
        try {
            message = decodeRawPacket();
        } catch (error) {
            message = "Error: caught unexpected exception \"" + error + "\".";
        }

        // display resulting status message
        updateStatusMessage(message);
    });

    // configure callback for changing packet schema input value
    var $packetSchemaInput = $("#packet-schema-input");
    $packetSchemaInput.change(function() {
        // determine total bits in sanitized packet schema
        var totalBits = updatePacketSchemaInput($(this));

        // update total bits for packet schema
        updateSchemaTotalBits(totalBits);
    });

    // configure callback for changing raw packet input value
    var $rawPacketInput = $("#raw-packet-input");
    $rawPacketInput.change(function() {
        // sanitize raw packet based on selected hex or binary format
        updateRawPacketInput($(this));
    });

    // parse values from optional parameters in URL query string
    var urlParams = window.location.search.substring(1).split('&');
    var formatInputValue = parseUrlParam(urlParams, URL_PARAM_FORMAT);
    var packetSchemaInputValue = parseUrlParam(urlParams, URL_PARAM_PACKET_SCHEMA);
    var rawPacketInputValue = parseUrlParam(urlParams, URL_PARAM_RAW_PACKET);

    // populate inputs with parsed values
    $packetSchemaInput.val(packetSchemaInputValue);
    $rawPacketInput.val(rawPacketInputValue);
    if (formatInputValue.toLowerCase() == OPTION_FORMAT_HEX) {
        $hexFormatButton.click();
    } else if (formatInputValue.toLowerCase() == OPTION_FORMAT_BIN) {
        $binFormatButton.click();
    } else {
        // sanitize input for raw packet value
        // (already included when populating any format button)
        $rawPacketInput.change();
    }

    // sanitize inputs for packet schema and total bits values
    $packetSchemaInput.change();
});

var decodeRawPacket = function() {
    // clear any previously populated values
    var $decodedPacketBinSpan = $("#decoded-packet-bin-span");
    $decodedPacketBinSpan.empty();
    var $decodedPacketHexSpan = $("#decoded-packet-hex-span");
    $decodedPacketHexSpan.empty();
    var $generatedUrlSpan = $("#generated-url-span");
    $generatedUrlSpan.empty();

    // get pre-sanitized packet schema from input
    var $packetSchemaInput = $("#packet-schema-input");
    var packetSchema = $packetSchemaInput.val();

    // get pre-sanitized raw packet from input
    var $rawPacketInput = $("#raw-packet-input");
    var rawPacket = $rawPacketInput.val();

    // separate and convert sub-fields in packet schema
    var schemaSubfields = packetSchema.split(',');
    schemaSubfields = schemaSubfields.map(function(subfield) {
        return parseInt(subfield, 10);
    });

    // clear sub-fields for empty packet schema
    if (schemaSubfields[0] == 0) {
        schemaSubfields = [];
    }

    // count leading zeros to add extra padding for binary value
    var matchedZeros = rawPacket.match(/^0+/);
    var numLeadZeros = matchedZeros ? matchedZeros[0].length : 0;

    // determine if hex or binary format is selected
    var $hexFormatButton = $("#hex-format-button");
    var hexFormat = $hexFormatButton.hasClass("btn-primary");
    if (hexFormat) {
        // convert hex bytes into binary string (without max size limit)
        var decValue = BigInt("0x" + rawPacket);
        var binValue = decValue.toString(2);

        // discount extra padding for leading zero at the LSb
        if (binValue == "0") {
            --numLeadZeros;
        }

        // insert padding to align binary value with hex value (4 bits per hex character)
        var paddedLen = Math.ceil(binValue.length / 4) * 4;
        paddedLen += (4 * numLeadZeros);
        binValue = binValue.padStart(paddedLen, '0');
    } else {
        // get binary string from raw packet
        var binValue = rawPacket;
    }

    // decode binary value according to packet schema
    var position = 0;
    for (var index = 0; index < schemaSubfields.length; ++index) {
        // increment position for each sub-field length
        position += schemaSubfields[index];

        // insert separators at position after each sub-field
        binValue = binValue.substring(0, position) + SUBFIELD_END_SEPARATOR + SUBFIELD_START_SEPARATOR +
            binValue.substring(position);

        // increment position for separators' lengths
        position += SUBFIELD_END_SEPARATOR.length + SUBFIELD_START_SEPARATOR.length;
    }

    // re-separate binary value into sub-fields
    var binSubfields = binValue.split(SUBFIELD_END_SEPARATOR + SUBFIELD_START_SEPARATOR);
    var hexSubfields = binSubfields.map(function(subfield) {
        // skip empty sub-field value
        if (subfield == "") {
            return "";
        }

        // convert each sub-field value from binary to hex
        var value = parseInt(subfield, 2);
        return value.toString(16);
    });

    // combine hex values according to packet schema
    var hexValue = "";
    for (var index = 0; index < hexSubfields.length; ++index) {
        // insert separator before each sub-field (excluding the first)
        if (index > 0) {
            hexValue += SUBFIELD_END_SEPARATOR + SUBFIELD_START_SEPARATOR;
        }

        // skip padding for empty sub-field value
        if (hexSubfields[index] == "") {
            continue;
        }

        // insert padding to align separators with binary sub-fields
        // (use no-break space character to align wrapping across new lines)
        paddedLen = binSubfields[index].length;
        hexValue += hexSubfields[index].padStart(paddedLen, '\u00A0');
    }

    // add separator at start of binary and hex values
    binValue = SUBFIELD_START_SEPARATOR + binValue;
    hexValue = SUBFIELD_START_SEPARATOR + hexValue;

    // remove any extra separator at end of binary and hex values
    if (binValue.endsWith(SUBFIELD_START_SEPARATOR)) {
        binValue = binValue.substring(0, binValue.length - SUBFIELD_START_SEPARATOR.length);
    }
    if (hexValue.endsWith(SUBFIELD_START_SEPARATOR)) {
        hexValue = hexValue.substring(0, hexValue.length - SUBFIELD_START_SEPARATOR.length);
    }

    // build copyable link with URL params for decoded packet
    if (hexFormat) {
        var formatText = OPTION_FORMAT_HEX;
    } else {
        var formatText = OPTION_FORMAT_BIN;
    }
    generatedUrl = "https://tacooper.github.io/packet-decoder.html?" + URL_PARAM_PACKET_SCHEMA + "=" + packetSchema +
        "&" + URL_PARAM_RAW_PACKET + "=" + rawPacket + "&" + URL_PARAM_FORMAT + "=" + formatText;

    // display decoded packet and generated URL values below successful status message
    $decodedPacketBinSpan.text("(Bin:) " + binValue);
    $decodedPacketHexSpan.text("(Hex:) " + hexValue);
    $generatedUrlSpan.html("<a href='" + generatedUrl + "'>Copy link for this decoded packet</a>");

    return "Successfully decoded packet into bit-fields separated by [ ]:";
}

var updatePacketSchemaInput = function($packetSchemaInput) {
    // sanitize packet schema for comma-separated decimal numbers only
    var packetSchema = $packetSchemaInput.val();
    packetSchema = packetSchema.replace(/[^0-9,]/g, '');
    packetSchema = packetSchema.replace(/^0+/, '');  // remove leading zeros
    packetSchema = packetSchema.replace(/,0+/g, ',');  // replace zeros following comma with single comma
    packetSchema = packetSchema.replace(/,+/g, ',');  // replace repeating commas with single comma
    packetSchema = packetSchema.replace(/^,/, '');  // remove leading comma
    packetSchema = packetSchema.replace(/,$/, '');  // remove trailing comma
    if (packetSchema == "") {
        // allow empty packet schema
        packetSchema = "0";
    }
    $packetSchemaInput.val(packetSchema);

    // separate and convert sub-fields in packet schema
    var schemaSubfields = packetSchema.split(',');
    schemaSubfields = schemaSubfields.map(function(subfield) {
        return parseInt(subfield, 10);
    });

    // sum all bit sizes in array of sub-fields
    var reducer = (accumulator, value) => accumulator + value;
    var totalBits = schemaSubfields.reduce(reducer);

    return totalBits;
}

var updateSchemaTotalBits = function(total) {
    // display total bits in packet schema
    var $schemaTotalSpan = $("#packet-schema-total-span");
    $schemaTotalSpan.text("(Total bits: " + total + ")");
}

var updateRawPacketInput = function($rawPacketInput) {
    // determine if hex or binary format is selected
    var $hexFormatButton = $("#hex-format-button");
    var hexFormat = $hexFormatButton.hasClass("btn-primary");
    if (hexFormat) {
        var regexp = /[^0-9A-Fa-f]/g;
    } else {
        var regexp = /[^01]/g;
    }

    // sanitize raw packet based on regular expression for hex or binary format
    var rawPacket = $rawPacketInput.val();
    rawPacket = rawPacket.replace(regexp, '');
    rawPacket = rawPacket.toLowerCase();
    if (rawPacket == "") {
        // allow empty raw packet
        rawPacket = "0";
    }
    $rawPacketInput.val(rawPacket);
}

var updateStatusMessage = function(message) {
    // generate current timestamp
    var date = new Date();
    var time = date.toLocaleTimeString("it-IT");

    // display timestamp and status message
    var $statusMessageSpan = $("#status-message-span");
    $statusMessageSpan.text("(" + time + ") " + message);
}

var parseUrlParam = function(urlParams, targetParam) {
    var paramValue = "";

    for (var index = 0; index < urlParams.length; ++index) {
        // separate each URL parameter into key and value pair
        var param = urlParams[index].split('=');

        // check for target URL parameter key
        if (param[0] == targetParam) {
            // decode URL parameter value if it exists
            if (param[1]) {
                paramValue = decodeURIComponent(param[1]);
            }

            break;
        }
    }

    return paramValue;
}
