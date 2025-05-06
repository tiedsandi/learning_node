import https from "https";

const url = "https://example.com/some/path?page=1&format=json";

const request = https.request(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  function(response) {
    response.addListener("data", function (data) {
      console.info(`Recieve : ${data.toString()}`);
    });
  },
});

const body = JSON.stringify({
  firstName: "fachran",
  lastName: "sandi",
});

request.write(body);
request.end();
