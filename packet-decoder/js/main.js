// run when page is ready
$(function () {
    // display version number
    var $versionSpan = $("#version-span");
    $versionSpan.text("Version: " + VERSION_NUMBER);

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

    // initialize sanitized packet schema and total bits
    $packetSchemaInput.change();

    // configure callback for changing raw packet input value
    var $rawPacketInput = $("#raw-packet-input");
    $rawPacketInput.change(function() {
        // sanitize raw packet for lowercase hexadecimal bytes only
        var rawPacket = $(this).val();
        rawPacket = rawPacket.replace(/[^0-9A-Fa-f]/g, '');
        rawPacket = rawPacket.toLowerCase();
        if (rawPacket == "") {
            // allow empty raw packet
            rawPacket = "0";
        }
        $(this).val(rawPacket);
    });

    // initialize sanitized raw packet
    $rawPacketInput.change();
});

var decodeRawPacket = function() {
    // clear any previously decoded packet values
    var $decodedPacketBinSpan = $("#decoded-packet-bin-span");
    $decodedPacketBinSpan.empty();
    var $decodedPacketHexSpan = $("#decoded-packet-hex-span");
    $decodedPacketHexSpan.empty();

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

    // converted hexadecimal bytes into binary string (without max size limit)
    var decValue = BigInt("0x" + rawPacket);
    var binValue = decValue.toString(2);

    // insert padding to align binary value with hex value (4 bits per hex character)
    var paddedLen = Math.ceil(binValue.length / 4) * 4;
    paddedLen += (4 * numLeadZeros);
    binValue = binValue.padStart(paddedLen, '0');

    // decode binary value according to packet schema
    var position = 0;
    for (var index = 0; index < schemaSubfields.length; ++index) {
        // increment position for each sub-field length
        position += schemaSubfields[index];

        // insert separator at position after each sub-field
        binValue = binValue.substring(0, position) + SUBFIELD_SEPARATOR + binValue.substring(position);

        // increment position for each separator length
        position += SUBFIELD_SEPARATOR.length;
    }

    // re-separate binary value into sub-fields
    var binSubfields = binValue.split(SUBFIELD_SEPARATOR);
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
            hexValue += SUBFIELD_SEPARATOR;
        }

        // skip padding for empty sub-field value
        if (hexSubfields[index] == "") {
            continue;
        }

        // insert padding to align separators with binary sub-fields
        paddedLen = binSubfields[index].length;
        hexValue += hexSubfields[index].padStart(paddedLen, ' ');
    }

    // display decoded packet values below successful status message
    $decodedPacketBinSpan.text("(Bin:) " + binValue);
    $decodedPacketHexSpan.text("(Hex:) " + hexValue);

    return "Successfully decoded packet into bit-fields:";
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

var updateStatusMessage = function(message) {
    // generate current timestamp
    var date = new Date();
    var time = date.toLocaleTimeString("it-IT");

    // display timestamp and status message
    var $statusMessageSpan = $("#status-message-span");
    $statusMessageSpan.text("[" + time + "] " + message);
}
