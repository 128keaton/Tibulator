const dgram = require('dgram');
const ip = require('ip');
const xml2js = require('xml2js');
const util = require('util');
const { v4: uuidv4 } = require('uuid');

const badKeys = ['$'];
const getMessage = (uuid) => {
  return `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:pnpx="http://schemas.microsoft.com/windows/pnpx/2005/10" xmlns:pub="http://schemas.microsoft.com/windows/pub/2005/07" xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:wsd="http://schemas.xmlsoap.org/ws/2005/04/discovery" xmlns:wsdp="http://schemas.xmlsoap.org/ws/2006/02/devprof" xmlns:wsx="http://schemas.xmlsoap.org/ws/2004/09/mex"><soap:Header><wsa:To>urn:schemas-xmlsoap-org:ws:2005:04:discovery</wsa:To><wsa:Action>http://schemas.xmlsoap.org/ws/2005/04/discovery/Probe</wsa:Action><wsa:MessageID>urn:uuid:${uuid}</wsa:MessageID></soap:Header><soap:Body><wsd:Probe><wsd:Types>wsdp:Device</wsd:Types></wsd:Probe></soap:Body></soap:Envelope>`;
};

const socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });

const parseObject = (object) => {
  if (typeof object === 'string' || object instanceof String)
    return `${object}`;

  if (Array.isArray(object)) {
    return object.map(parseObject);
  }

  const betterObject = {};

  Object.keys(object).forEach((key) => {
    const betterKey = key.split(':')[1] || key;

    if (badKeys.includes(betterKey)) return;
    betterObject[betterKey] = parseObject(object[key]);
  });

  return betterObject;
};

socket.on('listening', (err) => {
  if (err) throw err;
  socket.send(getMessage(uuidv4()), 3702, '239.255.255.250');
  setTimeout(() => socket.close(), 5000);
});

socket.on('message', (message, hostInfo) => {
  const rawXML = message.toString('utf-8');
  const address = hostInfo.address;

  xml2js.parseString(rawXML, (err, result) => {
      console.log(JSON.stringify(parseObject(result)));
  });
});

socket.bind(3702, ip.address(), () => {
  socket.addMembership('239.255.255.250');
  socket.setMulticastTTL(100);
});
