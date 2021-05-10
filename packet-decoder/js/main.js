// run when page is ready
$(function () {
    // display version number
    var $versionSpan = $("#version-span");
    $versionSpan.text("Version: " + VERSION_NUMBER);

    // configure callback for clicking decode button
    var $decodeButton = $("#decode-button");
    $decodeButton.click(function() {
        // decode raw packet according to packet schema
        var message = decodeRawPacket();

        // display resulting status message
        updateStatusMessage(message);
    });
});

var decodeRawPacket = function() {
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

    // check for empty inputs
    if (packetSchema == "") {
        return "Error: Failed to parse empty packet schema!";
    }
    if (rawPacket == "") {
        return "Error: Failed to parse empty raw packet!";
    }

    // TODO: handle decoding raw packet into sub-fields according to packet schema
}

var updateStatusMessage = function(message) {
    // generate current timestamp
    var date = new Date();
    var time = date.toLocaleTimeString("it-IT");

    // display timestamp and status message
    var $statusMessageSpan = $("#status-message-span");
    $statusMessageSpan.text("[" + time + "] " + message);
}
