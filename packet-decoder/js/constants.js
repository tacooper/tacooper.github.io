// Packet Decoder version number
const VERSION_NUMBER = "1.4.0";

// characters for separating each sub-field in decoded packet
const SUBFIELD_START_SEPARATOR = "[ ";
const SUBFIELD_END_SEPARATOR = " ]";

// parameters in URL query string for populating input values
const URL_PARAM_FORMAT = "format";
const URL_PARAM_PACKET_SCHEMA = "packet_schema";
const URL_PARAM_RAW_PACKET = "raw_packet";

// options for format URL parameter value
const OPTION_FORMAT_BIN = "bin";
const OPTION_FORMAT_HEX = "hex";
