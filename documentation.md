# find_jobs

## Overview Routes :

> ## / :
>
> - `POST, /login`
> - `POST, /register`
> - `GET, /profile`
> - `GET, /companies`
>
> ## /jobs
>
> - `GET, /jobs`
> - `POST, /jobs`
> - `GET, /jobs/:jobId`
> - `PUT, /jobs/:jobId`
> - `DELETE, /jobs/:jobId`

## `POST, /login`

Login into an already registered account.

### request.body:

```json
{
  "email": "string",
  "password": "string"
}
```

### If success: code 200

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJlbWFpbCI6InRoZWJsYWNrc3dvcmRzbWFuOTVAZ21haWwuY29tIiwicm9sZSI6InN0YWZmIiwiaWF0IjoxNjQ2NTc2NDk3fQ.ZrKPSvuezx41cxVebYFVOETRlS6cDiDEqrKieFb8cO8"
}
```

### If password or email is not inputted : code 401

```json
{
  "Error": "Email and Password is required"
}
```

### If fail to validate : code 401

```json
{
  "Error": "Wrong email or password"
}
```

### If anything else failed : code 500

```json
{
  "Error": "Internal Server Error"
}
```

## `POST, /register`

Register new account into the database with admin as its role

### request.body:

```json
{
  "email": "string",
  "password": "string",
  "phoneNumber": "string",
  "address": "string"
}
```

### If success: code 201

```json
{
  "id": "1",
  "email": "example@mail.com",
}
```

### If fail to validate : code 400

```json
{
  "Error": "Email cannot be empty"
}
AND/OR
{
  "Error": "Email must be email format"
}
AND/OR
{
  "Error": "Email must be unique"
}
AND/OR
{
  "Error": "Password cannot be empty"
}
AND/OR
{
  "Error": "Password cannot be empty"
}
AND/OR
{
  "Error": "Password length minimum 5 letters"
}
```

### If anything else failed : code 500

```json
{
  "Error": "Internal server error"
}
```

## `GET, /profile`

Get logged in user info.

### request.headers:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJlbWFpbCI6InRoZWJsYWNrc3dvcmRzbWFuOTVAZ21haWwuY29tIiwicm9sZSI6InN0YWZmIiwiaWF0IjoxNjQ2NTc2NDk3fQ.ZrKPSvuezx41cxVebYFVOETRlS6cDiDEqrKieFb8cO8"
  }
```

### If success: code 200

```json
{
    "id": 1,
    "email": "test@mail.com",
    "role": "admin"
}
```

### If user not found : code 401

```json
{
  "Error": "User not found"
}
```

### If anything else failed : code 500

```json
{
  "Error": "Internal Server Error"
}
```

## `GET, /companies`

List all companies currently stored in database from table named "Companies"

### request.headers:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJlbWFpbCI6InRoZWJsYWNrc3dvcmRzbWFuOTVAZ21haWwuY29tIiwicm9sZSI6InN0YWZmIiwiaWF0IjoxNjQ2NTc2NDk3fQ.ZrKPSvuezx41cxVebYFVOETRlS6cDiDEqrKieFb8cO8"
  }
```

### If success: code 200

```json
[
  {
    "id": 10,
    "name": "Company 1",
    "companyLogo": "http://placekitten.com/c/100/100",
    "location": "place1",
    "email": "company@gmail.com",
    "description": "testing",
    "createdAt": "2022-03-06T15:02:41.120Z",
    "updatedAt": "2022-03-06T15:02:41.120Z"
  },
  {
    "id": 11,
    "name": "Company 2",
    "companyLogo": "http://placekitten.com/d/100/100",
    "location": "place2",
    "email": "company@gmail.com",
    "description": "testing",
    "createdAt": "2022-03-06T15:02:41.121Z",
    "updatedAt": "2022-03-06T15:02:41.121Z"
  }
  ...,
]
```

### If failed : code 500

```json
{
  "Error": "Internal server error"
}
```

## `POST, /jobs`

Create a new database entry on a table named "Jobs"

### request.headers:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJlbWFpbCI6InRoZWJsYWNrc3dvcmRzbWFuOTVAZ21haWwuY29tIiwicm9sZSI6InN0YWZmIiwiaWF0IjoxNjQ2NTc2NDk3fQ.ZrKPSvuezx41cxVebYFVOETRlS6cDiDEqrKieFb8cO8"
  }
```

### request.body:

```json
{
  "title": "string",
  "description": "text",
  "imgUrl": "string",
  "companyId": "integer",
  "jobType": "string",
}
```

### If success: code 201

```json
{
    "id": 13,
    "title": "title",
    "description": "desc",
    "imgUrl": "asdas",
    "companyId": 1,
    "authorId": 1,
    "jobType": "asda",
    "updatedAt": "2022-03-06T15:17:56.891Z",
    "createdAt": "2022-03-06T15:17:56.891Z"
}
```

### If fail to validate : code 400

```json
{
  "Error": "Title cannot be empty"
}
AND/OR
{
  "Error": "Description cannot be empty"
}
AND/OR
{
  "Error": "Image URL cannot be empty"
}
AND/OR
{
  "Error": "Job Type cannot be empty"
}
```

### If anything else failed : code 500

```json
{
  "Error": "Internal server error"
}
```

## `GET, /jobs`

List all jobs currently stored in database from table named "Jobs"

### request.headers:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJlbWFpbCI6InRoZWJsYWNrc3dvcmRzbWFuOTVAZ21haWwuY29tIiwicm9sZSI6InN0YWZmIiwiaWF0IjoxNjQ2NTc2NDk3fQ.ZrKPSvuezx41cxVebYFVOETRlS6cDiDEqrKieFb8cO8"
  }
```

### If success: code 200

```json
[
  {
    "id": 12,
    "title": "Need Slaves",
    "description": "Lorem Ipsum",
    "imgUrl": "http://placekitten.com/b/100/100",
    "companyId": 1,
    "authorId": 1,
    "jobType": "Full-Time",
    "createdAt": "2022-03-06T15:02:41.377Z",
    "updatedAt": "2022-03-06T15:02:41.377Z",
    "Company": {
      "id": 1,
      "name": "test",
      "companyLogo": "test",
      "location": "test",
      "email": "test",
      "description": "test",
      "createdAt": "2022-03-01T11:37:49.668Z",
      "updatedAt": "2022-03-01T11:37:49.668Z"
    }
  },
    {
    "id": 11,
    "title": "Need Acountant ASAP",
    "description": "Lorem Ipsum",
    "imgUrl": "http://placekitten.com/a/100/100",
    "companyId": 1,
    "authorId": 1,
    "jobType": "Part-Time",
    "createdAt": "2022-03-06T15:02:41.377Z",
    "updatedAt": "2022-03-06T15:02:41.377Z",
    "Company": {
      "id": 1,
      "name": "test",
      "companyLogo": "test",
      "location": "test",
      "email": "test",
      "description": "test",
      "createdAt": "2022-03-01T11:37:49.668Z",
      "updatedAt": "2022-03-01T11:37:49.668Z"
      }
    }
  ...,
]
```

### If failed : code 500

```json
{
  "Error": "Internal server error"
}
```

## `GET, /jobs/:jobId`

Find one instance of job that has the same id as ':jobId' from table named "Jobs"

### request.headers:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJlbWFpbCI6InRoZWJsYWNrc3dvcmRzbWFuOTVAZ21haWwuY29tIiwicm9sZSI6InN0YWZmIiwiaWF0IjoxNjQ2NTc2NDk3fQ.ZrKPSvuezx41cxVebYFVOETRlS6cDiDEqrKieFb8cO8"
  }
```

### request.params:

```json
{
  "jobId": "integer"
}
```

### If success: code 200

```json
{
  "id": 1,
  "title": "aasd",
  "description": "sZZZ",
  "imgUrl": "11",
  "companyId": 1,
  "authorId": 1,
  "jobType": "full time xxx",
  "createdAt": "2022-03-01T11:40:14.923Z",
  "updatedAt": "2022-03-06T12:26:58.449Z",
  "Company": {
    "id": 1,
    "name": "test",
    "companyLogo": "test",
    "location": "test",
    "email": "test",
    "description": "test",
    "createdAt": "2022-03-01T11:37:49.668Z",
    "updatedAt": "2022-03-01T11:37:49.668Z"
  }
}
```

### If failed to find job : code 404

```json
{
  "Error": "Error job not found" 
}
```

### If anything else failed : code 500

```json
{
  "Error": "Internal server error"
}
```

## `PUT, /jobs/:jobId`

Edit one entry of table "Jobs" that has the same id as ':jobId'

### request.headers:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJlbWFpbCI6InRoZWJsYWNrc3dvcmRzbWFuOTVAZ21haWwuY29tIiwicm9sZSI6InN0YWZmIiwiaWF0IjoxNjQ2NTc2NDk3fQ.ZrKPSvuezx41cxVebYFVOETRlS6cDiDEqrKieFb8cO8"
  }
```

### request.params:

```json
{
  "jobId": "integer"
}
```

### request.body:

```json
{
  "title": "string",
  "description": "text",
  "imgUrl": "string",
  "companyId": "integer",
  "jobType": "string",
}
```

### If success: code 200

```json
{
    "id": 1,
    "title": "title",
    "description": "desc",
    "imgUrl": "asdas",
    "companyId": 1,
    "authorId": 1,
    "jobType": "asda",
    "createdAt": "2022-03-01T11:40:14.923Z",
    "updatedAt": "2022-03-06T15:26:36.992Z"
}
```

### If failed to find job : code 404

```json
{
  "Error": "Error job not found" 
}
```

### If fail to validate : code 400

```json
{
  "Error": "Title cannot be empty"
}
AND/OR
{
  "Error": "Description cannot be empty"
}
AND/OR
{
  "Error": "Image URL cannot be empty"
}
AND/OR
{
  "Error": "Job Type cannot be empty"
}
```

### If anything else failed : code 500

```json
{
  "Error": "Internal server error"
}
```

## `DELETE, /jobs/:jobId`

Delete an entry of job from table named "Jobs"

### request.headers:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJlbWFpbCI6InRoZWJsYWNrc3dvcmRzbWFuOTVAZ21haWwuY29tIiwicm9sZSI6InN0YWZmIiwiaWF0IjoxNjQ2NTc2NDk3fQ.ZrKPSvuezx41cxVebYFVOETRlS6cDiDEqrKieFb8cO8"
  }
```

### request.params:

```json
{
  "jobId": "integer"
}
```

### If success: code 200

```json
{
  "message": "Job title success to delete"
}
```

### If failed to find job : code 404

```json
{
  "Error": "Error job not found" 
}
```

### If anything else failed : code 500

```json
{
  "Error": "Internal server error"
}
```
