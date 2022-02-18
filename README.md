# LearningAPI

Demo API online course platform untuk user dan admin.

Cara Install:
1. Install semua dependency yang di butuhkan dengan 'npm install' (tanpa petik)
2. run server dengan 'npm start' (tanpa petik)
3. buka endpoints Localhost:5000/users atau Localhost:5000/admin di Postman untuk menggunakan API

Atau

1. buka https://courselearningapi.herokuapp.com/users atau https://courselearningapi.herokuapp.com/admin di Postman untuk menggunakan API


Endpoints:

1. mendapatkan informasi mengenai course yang tersedia

GET https://courselearningapi.herokuapp.com/admin/courses - mendapatkan semua courses

Jika ingin mencari informasi spesifik seperti title course dapat di query dengan cara menambahkan ?title=value

GET https://courselearningapi.herokuapp.com/admin/courses?title=node - mendapatkan semua courses dengan title mengandung string node

Model courses

"title": String
"description": String
"category": String
"creator": String
"image": String
"image_id": String
"price": Number
