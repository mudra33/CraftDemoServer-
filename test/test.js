let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');

//Assertion Style
chai.should();

chai.use(chaiHttp);

let token =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDBjOGI2ZmI3M2Q3OTgxZTU2OTNlZTUiLCJkdXJhdGlvbiI6MzYwMCwiaWF0IjoxNjc4ODAxNTA5LCJleHAiOjE2Nzg4MDUxMDl9.yeSk3Hube5kNJU8BFQSynLFKMXylSvF00Z7FJjI2Ryc';

// beforeAll(async () => {
//   token = response.body.token;
// });

describe('GET /api/account', () => {
	it('It should NOT GET all the accounts', (done) => {
		chai
			.request(server)
			.get('/api/account')
			.set('Authorization', `Bearer ${token}`)
			.end((err, response) => {
				response.should.have.status(404);
				done();
			});
	});
});

// describe('GET /api/accounts', async() => {
// 	it('Given The Account does not exist', (done) => {
// 		chai
// 			.request(server)
// 			.get('/api/account')
// 			.set('Authorization', `Bearer ${token}`)
// 			.end((err, response) => {
// 				response.should.have.status(404);
// 				done();
// 			});
// 	});
// });

describe('GET /api/accounts/:id', () => {
	it('It should GET a account by ID', (done) => {
		const accountId = '640cec24e6fe2c52042a231c';
		chai
			.request(server)
			.get('/api/accounts/' + accountId)
			.set('Authorization', `Bearer ${token}`)
			.end((err, response) => {
				response.should.have.status(200);
				response.body.should.be.a('object');
				response.body.should.have.property('userName');
				response.body.should.have.property('email');
				response.body.should.have.property('category');
				response.body.should.have.property('id').eq(1);
				done();
			});
	});
});
