const path = require('path');
const protoLoader = require('@grpc/proto-loader');
const grpc = require('@grpc/grpc-js');

//grpc service def for greet

const greetProtoPath = path.join(__dirname, '..', 'protos', 'greet.proto');
const greetProtoDefinition = protoLoader.loadSync(greetProtoPath, {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true,
});

const greetPackageDefinition =
	grpc.loadPackageDefinition(greetProtoDefinition).greet;

function greet(call, callback) {
	const firstName = call.request.greeting.first_name;
	const lastName = call.request.greeting.last_name;

	callback(null, { result: `Hello ${firstName} ${lastName}` });
}

function main() {
	const server = new grpc.Server();

	server.addService(greetPackageDefinition.GreetService.service, {
		greet: greet,
	});

	const addr = 'localhost:50051';
	const creds = grpc.ServerCredentials.createInsecure();

	function cleanup(server) {
		console.log('Cleaning up');

		if (server) {
			server.forceShutdown();
		}
	}

	server.bindAsync(addr, creds, (err, _) => {
		if (err) {
			return cleanup(server);
		}

		server.start();
	});

	console.log(`Server running at ${addr}`);
}

main();
