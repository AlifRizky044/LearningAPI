# LearningAPI

Demo API online course platform untuk user dan admin.

Cara Install:
1. Install semua dependency yang di butuhkan dengan 'npm install' (tanpa petik)
2. run server dengan 'npm start' (tanpa petik)
3. buka endpoints Localhost:5000/users atau Localhost:5000/admin di Postman untuk menggunakan API

Atau

1. buka https://courselearningapi.herokuapp.com/users atau https://courselearningapi.herokuapp.com/admin di Postman untuk menggunakan API


Endpoints:

1. register admin

POST https://courselearningapi.herokuapp.com/admin/register

body type json:
{
    "username":String,
    "email":String,
    "password":String,
    "image":String
}

2. login untuk mendapatkan JsonWebToken agar dapat mengakses API

POST https://courselearningapi.herokuapp.com/admin/login

body tupe json:
{
    "email":String,
    "password":String
}

3. mendapatkan informasi mengenai course yang tersedia

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

4. mendapatkan Informasi jumlah user, jumlah courses, dan jumlah courses yang gratis

GET https://courselearningapi.herokuapp.com/admin/courses/statistics

5. Mengupdate data courses

POST https://courselearningapi.herokuapp.com/admin//upd-courses/:id

:id diubah menjadi id mongodb courses.

body dalam bentuk json berisi data yang ingin diubah meliputi
{
    "title": String
    "description": String
    "category": String
    "creator": String
    "image": String
    "image_id": String
    "price": Number
}

6. 
