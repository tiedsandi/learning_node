function samplePromise() {
  return Promise.resolve('sandi');
}

const name = await samplePromise(); // tidak error karena .mjs adalah async module
console.log(name);
