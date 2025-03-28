function samplePromise() {
  return Promise.resolve('sandi');
}

// const name = await samplePromise(); // Error: await is only valid in async function
// console.log(name);

async function run() {
  const name = await samplePromise();
  console.log(name);
}

run();
