import net from "net";

const client = net.createConnection({ port: 3000, host: "localhost" });

setInterval(function () {
  // client.write("sandi\r\n");
  client.write(`${process.argv[2]}\r\n`);
}, 2000);

client.addListener("data", function (data) {
  console.info(`Recieve data from server : ${data.toString()}`);
});
