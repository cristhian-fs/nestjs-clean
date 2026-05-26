POST http://localhost:3333/api/accounts
Content-Type: application/json
{
  "name": "cris",
  "email": "test@test.com",
  "password": "12345678"
}

POST http://localhost:3333/api/sessions
Content-Type: application/json
{
  "email": "test@test.com",
  "password": "12345678"
}

HTTP 200
[Captures]
token: jsonpath "$.access_token"
