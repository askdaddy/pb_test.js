/**
 * Created by seven on 14/11/2017.
 */

const util = require('util');
const fs = require('fs');

var conf = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

/**
 * message structure:
 *
 *     pkg_len        hd_len        header              body
 * |----------------|--------|-------------------|-------------------...
 *     uint32         uint16  common.PacketHeader     Any Message
 */

// emmit Echo message to server
var comm_pb = require('./protocol/common_pb');

var head = new comm_pb.PacketHeader();
head.setHeaderId('10000000000777');
head.setVersion('1');
head.setCommand(proto.Constant.Command.CMD_ECHO)

var head_buf = Buffer.from(head.serializeBinary());
console.log('Send packet head length: ', head_buf.length);

var body = new comm_pb.MessageInfo();
body.setFromId('seven777');
body.setContent('Fxxk you!!!');

var body_buf = Buffer.from(body.serializeBinary());
console.log('Send packet body length: ', body_buf.length);

// packing start ....
var head_len_buf = Buffer.allocUnsafe(2);
// write head length to msg offset 0 (start position)
head_len_buf.writeUInt16BE(head_buf.length, 0);

// concatenating head.length/head/body together
const msg_len = head_len_buf.length + head_buf.length + body_buf.length;


var msg = Buffer.concat([head_len_buf, head_buf, body_buf], msg_len);

var msg_len_buf = Buffer.allocUnsafe(4);
msg_len_buf.writeUInt32BE(msg.length, 0);

console.log('Send message length: ', msg.length);

// last step
const packet = Buffer.concat([msg_len_buf, msg], msg_len_buf.length + msg.length);

console.log('Send packet length: ', packet.length);


// send packet to server
var net = require('net');

const HOST = conf.server;
const PORT = conf.port;

var client = new net.Socket();
client.connect(PORT, HOST, function () {

    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
    client.write(packet);

});

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function (pkt) {

    console.log('Received packet length: ', pkt.length);

    const d_msg_len = pkt.readUInt32BE(0);
    const d_msg = pkt.slice(4);

    console.log('Received msg len: ', d_msg_len);

    const d_head_len = d_msg.readUInt16BE(0);
    const d_head = d_msg.slice(2, 2 + d_head_len);

    console.log('Received head len: ', d_head_len);

    const pb_head = comm_pb.PacketHeader.deserializeBinary(new Uint8Array(d_head));
    console.log(util.inspect(pb_head, false, null));

    const d_body = d_msg.slice(2 + d_head_len);

    const pb_body = comm_pb.MessageInfo.deserializeBinary(new Uint8Array(d_body));
    console.log(util.inspect(pb_body, false, null));


    // Close the client socket completely
    client.destroy();

});

// Add a 'close' event handler for the client socket
client.on('close', function () {
    console.log('Connection closed');
});


var printchar = function (data) {
    for (var i = 0; i < data.length; ++i) {
        console.log(String.fromCharCode(data[i]));
    }
}