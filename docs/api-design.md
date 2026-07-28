Authentication

POST /auth/register

POST /auth/login

-----------------------------------

Users

GET /users/{id}

PUT /users/{id}

-----------------------------------

Categories

GET /categories

POST /categories

DELETE /categories/{id}

-----------------------------------

Gigs

GET /gigs

GET /gigs/{id}

POST /gigs

PUT /gigs/{id}

DELETE /gigs/{id}

-----------------------------------

Orders

POST /orders

GET /orders

GET /orders/{id}

PUT /orders/{id}/accept

PUT /orders/{id}/complete

DELETE /orders/{id}

-----------------------------------

Wallet

GET /wallet

GET /wallet/transactions

-----------------------------------

Reviews

POST /reviews

GET /reviews/{gigId}