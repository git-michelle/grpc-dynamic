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

const addr = 'localhost:50051';

const greetPackageDefinition =
	grpc.loadPackageDefinition(greetProtoDefinition).greet;

const client = new greetPackageDefinition.GreetService(
	addr,
	grpc.credentials.createInsecure()
);

function callGreetings() {
	const req = {
		greeting: {
			first_name: 'Micky',
			last_name: 'Mouse',
		},
	};

	client.greet(req, (err, response) => {
		if (!err) {
			console.log(`Greeting response: ${response.result}`);
		} else {
			console.log(err);
		}
	});
}

function main() {
	callGreetings();
}

main();
