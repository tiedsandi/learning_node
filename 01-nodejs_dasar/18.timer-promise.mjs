import timers from "timers/promises";

// console.info(new Date());
// const name = await timers.setTimeout(5000, "sandi");
// console.info(new Date());
// console.info(name);

const interval = 1000;
for await (const startTime of timers.setInterval(interval, "ignored")) {
  console.info(`start time at ${new Date()}`);
  console.info(startTime);
}
