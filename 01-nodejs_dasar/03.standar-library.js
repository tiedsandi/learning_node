import os from 'os';

console.info(os.platform());
console.table(os.cpus());

// katanya error karena os itu bukan module yang bisa diimport
// tapi kenapa bisa diimport ya?
// karena os itu adalah module bawaan dari node.js
// jadi pakainya .mjs bukan .js karena .js itu untuk ES5 dan .mjs itu untuk ES6
