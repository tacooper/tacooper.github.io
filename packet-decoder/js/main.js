// run when page is ready
$(function () {
    // display version number
    var $versionSpan = $("#version-span");
    $versionSpan.text("Version: " + VERSION_NUMBER);

    // configure callback for clicking decode button
    var $decodeButton = $("#decode-button");
    $decodeButton.click(function() {
        // decode raw packet into schema sub-fields
        decodeRawPacket();
    });
});

var decodeRawPacket = function() {
    // get raw packet from input
    var $rawPacketInput = $("#raw-packet-input");
    var rawPacket = $rawPacketInput.val();

    // TODO: handle decoding raw packet into schema sub-fields
    updateStatusMessage("Error: Failed to parse raw packet!");
}

var updateStatusMessage = function(message) {
    var $statusMessageSpan = $("#status-message-span");
    $statusMessageSpan.text(message);
}
