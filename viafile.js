/**
 * Created by seven on 14/11/2017.
 */

const util = require('util');

var messages = require('./protocol/common_pb');

var message = new messages.PacketHeader();

message.setHeaderId('255');
message.setVersion(12);
message.setCommand(proto.Constant.Command.CMD_INIT)


// Serializes to a UInt8Array.
bin = message.serializeBinary();


console.info(bin.toString())
console.info(' ---------- ');

var fs = require('fs');
fs.writeFile('./bytes.txt', bin.toString(), function (err) {
    if (err) {
        return console.error(err);
    }

    obj = messages.PacketHeader.deserializeBinary(bin);
    console.log(util.inspect(obj, false, null));
})