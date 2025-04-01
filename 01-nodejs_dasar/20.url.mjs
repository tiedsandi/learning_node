const url = new URL("https://example.com/some/path?page=1&format=json");

console.info(url.toString());
console.info(url.href);
console.info(url.protocol);
console.info(url.host);
console.info(url.pathname);
console.info(url.searchParams);

url.host = "www.sandi.com";
const searchParam = url.searchParams;
searchParam.append("status", "premium");

console.info(url.toString());
console.info(url);
