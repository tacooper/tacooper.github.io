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
        // get packet schema from input and update with sanitized value
        var packetSchema = sanitizePacketSchema($(this));
        $packetSchemaInput.val(packetSchema);

        // skip summing total bits for empty input
        var totalBits = 0;
        if (packetSchema != "") {
            // separate and convert sub-fields in packet schema
            var schemaSubfields = packetSchema.split(',');
            schemaSubfields = schemaSubfields.map(function(subfield) {
                return parseInt(subfield, 10);
            });

            // sum all bit sizes in array of sub-fields
            var reducer = (accumulator, value) => accumulator + value;
            totalBits = schemaSubfields.reduce(reducer);
        }

        // update total bits in packet schema
        updateSchemaTotalBits(totalBits);
    });

    // initialize total bits in packet schema
    $packetSchemaInput.change();
});

var decodeRawPacket = function() {
    // clear any previously decoded packet values
    var $decodedPacketBinarySpan = $("#decoded-packet-binary-span");
    $decodedPacketBinarySpan.empty();
    var $decodedPacketHexSpan = $("#decoded-packet-hex-span");
    $decodedPacketHexSpan.empty();

    // get pre-sanitized packet schema from input
    var $packetSchemaInput = $("#packet-schema-input");
    var packetSchema = $packetSchemaInput.val();

    // get raw packet from input
    var $rawPacketInput = $("#raw-packet-input");
    var rawPacket = $rawPacketInput.val();

    // sanitize raw packet for lowercase hexadecimal bytes only
    rawPacket = rawPacket.replace(/[^0-9A-Fa-f]/g, '');
    rawPacket = rawPacket.toLowerCase();
    $rawPacketInput.val(rawPacket);

    // check for error due to any empty input
    if (packetSchema == "") {
        return "Error: Failed to parse empty packet schema.";
    }
    if (rawPacket == "") {
        return "Error: Failed to parse empty raw packet.";
    }

    // separate and convert sub-fields in packet schema
    var schemaSubfields = packetSchema.split(',');
    schemaSubfields = schemaSubfields.map(function(subfield) {
        return parseInt(subfield, 10);
    });

    // converted hexadecimal bytes into binary string
    var decimalValue = parseInt(rawPacket, 16);
    var binaryValue = decimalValue.toString(2);

    // decode binary value according to packet schema
    var position = 0;
    for (var index = 0; index < schemaSubfields.length; ++index) {
        // increment position for each sub-field length
        position += schemaSubfields[index];

        // insert separator at position after each sub-field
        binaryValue = binaryValue.substring(0, position) + SUBFIELD_SEPARATOR + binaryValue.substring(position);

        // increment position for each separator length
        position += SUBFIELD_SEPARATOR.length;
    }

    // re-separate binary value into sub-fields
    var binarySubfields = binaryValue.split(SUBFIELD_SEPARATOR);
    var hexSubfields = binarySubfields.map(function(subfield) {
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

        hexValue += hexSubfields[index];
    }

    // display decoded packet values below successful status message
    $decodedPacketBinarySpan.text("(bin:) " + binaryValue);
    $decodedPacketHexSpan.text("(hex:) " + hexValue);

    return "Successfully decoded packet into bit-fields:";
}

var sanitizePacketSchema = function($packetSchemaInput) {
    var packetSchema = $packetSchemaInput.val();

    // sanitize packet schema for comma-separated decimal numbers only
    packetSchema = packetSchema.replace(/[^0-9,]/g, '');
    packetSchema = packetSchema.replace(/,+/g, ',');  // remove double comma sets
    packetSchema = packetSchema.replace(/^,/, '');  // remove leading comma
    packetSchema = packetSchema.replace(/,$/, '');  // remove trailing comma

    return packetSchema;
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
