'use strict';

const bs58check = require('bs58check');

// Reserialize addresses from BTC or ZCL to BTCP
var convertAddresses = addresses => {
  const btcpVersionBytes = Buffer.from([0x13, 0x25]);

  let btcpAddresses = [];
  
  try {
    for (let a of addresses) {
      let raw = bs58check.decode(a);
      //console.log(a);
      //console.log(raw);
  
      let first = raw.slice(0,1).toString('hex');
      if (first === '00' || first === '05') { // BTC
        let newBuffer = Buffer.concat([btcpVersionBytes, raw.slice(1)]);
        btcpAddresses.push(bs58check.encode(newBuffer).toString());
      } else {
        let firstTwo = raw.slice(0,2).toString('hex')
        if (firstTwo === '1325' || firstTwo === '13af') { // BTCP
          btcpAddresses.push(a);
        } else if (firstTwo === '1cb8' || firstTwo === '1cbd') { // ZCL
          let newBuffer = Buffer.concat([btcpVersionBytes, raw.slice(2)]);
          btcpAddresses.push(bs58check.encode(newBuffer).toString());
        } else {
          console.log('UNKNOWN VERSION BYTES');
        }
      }
    }
  } catch (e) { console.log('error'); throw e; }

  return btcpAddresses;
}

//const exampleOutput = convertAddresses(['b1CypS2LjfM4qV5AwJkUudkJqfvwNSs2T6K', 't1euD4gB45npWpcpN7W5AuniU2sZoG3XfNE','1FH43sVnAtEkUchQyJtZGAdKGS7KZjPaJB']);
//console.log(exampleOutput);

// Run with: node lib/convert.js

module.exports = {convertAddresses: convertAddresses};
