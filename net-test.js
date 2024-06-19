const { net } = require("electron");

async function resolveHost(hostname) {
  try {
    console.log(`net.resolveHost(${hostname})`, await net.resolveHost(hostname));
  } catch (err) {
    console.log(`ERROR in net.resolveHost(${hostname})`, err, err.message);
  }
}

async function test() {
  // const request = net.request({
  //   url: "https://github.com",
  //   origin: "dummy-utility-process",
  // });
  // request.on('login', (e) => {
  //   console.log('Received login', e);
  // })
  // request.on("response", (response) => {
  //   console.log(`STATUS: ${response.statusCode}`);
  //   // console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
  //   response.on("data", (chunk) => {
  //     // console.log(`BODY: ${chunk}`)
  //   });
  //   response.on("end", () => {
  //     console.log("No more data in response.");
  //   });
  // });
  // request.setHeader("process-type", "utility");
  // request.end();

  // net
  //   .fetch("https://github.com")
  //   .then((response) => console.log("fetch status", response.status));
  // await new Promise((resolve) => setTimeout(resolve, 30000));

  net.fetch("https://google.com").then((response) => {
    console.log("utility fetch status", response.status);
  });

  // console.log("net.isOnline() : ", net.isOnline());
  // console.log("net.online : ", net.online);

  // await resolveHost("github.com");
  // await resolveHost("example.com");
  // await resolveHost("idontthinkexists.com");
  
  // process.exit(0);
}

test();
