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
});

var decodeRawPacket = function() {
    // clear any previously decoded packet
    var $decodedPacketSpan = $("#decoded-packet-span");
    $decodedPacketSpan.empty();

    // get packet schema from input
    var $packetSchemaInput = $("#packet-schema-input");
    var packetSchema = $packetSchemaInput.val();

    // sanitize packet schema for comma-separated decimal numbers only
    packetSchema = packetSchema.replace(/[^0-9,]/g, '');
    packetSchema = packetSchema.replace(/,+/g, ',');  // remove double comma sets
    packetSchema = packetSchema.replace(/^,/, '');  // remove leading comma
    packetSchema = packetSchema.replace(/,$/, '');  // remove trailing comma
    $packetSchemaInput.val(packetSchema);

    // get raw packet from input
    var $rawPacketInput = $("#raw-packet-input");
    var rawPacket = $rawPacketInput.val();

    // sanitize raw packet for hexadecimal bytes only
    rawPacket = rawPacket.replace(/[^0-9A-Fa-f]/g, '');
    $rawPacketInput.val(rawPacket);

    // check for error due to any empty input
    if (packetSchema == "") {
        return "Error: Failed to parse empty packet schema.";
    }
    if (rawPacket == "") {
        return "Error: Failed to parse empty raw packet.";
    }

    // converted hexadecimal bytes into binary string
    var decimalValue = parseInt(rawPacket, 16);
    var binaryValue = decimalValue.toString(2);

    // separate and convert sub-fields in packet schema
    var schemaSubfields = packetSchema.split(',');
    var schemaSubfields = schemaSubfields.map(function(subfield) {
        return parseInt(subfield, 10);
    });

    var decodedPacket = binaryValue;
    var position = 0;
    for (var index = 0; index < schemaSubfields.length; ++index) {
        // increment position for each sub-field length
        position += schemaSubfields[index];

        // insert separator at position after each sub-field
        decodedPacket = decodedPacket.substring(0, position) + SUBFIELD_SEPARATOR + decodedPacket.substring(position);

        // increment position for each separator length
        position += SUBFIELD_SEPARATOR.length;
    }

    // TODO: handle decoding sub-fields into hexadecimal format

    // display decoded packet below successful status message
    $decodedPacketSpan.text(decodedPacket);

    return "Successfully decoded packet:";
}

var updateStatusMessage = function(message) {
    // generate current timestamp
    var date = new Date();
    var time = date.toLocaleTimeString("it-IT");

    // display timestamp and status message
    var $statusMessageSpan = $("#status-message-span");
    $statusMessageSpan.text("[" + time + "] " + message);
}
