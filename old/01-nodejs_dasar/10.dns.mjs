// import dns from 'dns/promises';

// const address = await dns.lookup('www.netlify.com');

// console.info(address.address);
// console.info(address.family);

import dns from "dns";

function callback(erro, ip) {
  console.info(ip);
}

dns.lookup("www.netlify.com", callback);
