POST http://localhost:3333/api/sessions
Content-Type: application/json
{
  "email": "test@test.com",
  "password": "12345678"
}

HTTP 200
[Captures]
token: jsonpath "$.access_token"

POST http://localhost:3333/api/questions
Authorization: Bearer {{token}}
Content-Type: application/json
{
	"title": "Question {{now}}",
	"content": "Question {{now}}"
}

GET http://localhost:3333/api/questions?page=2
Authorization: Bearer {{token}}
Content-Type: application/json
