define({ "api": [
  {
    "type": "post",
    "url": "/api/v1/users/forgotPwd",
    "title": "api for user forgot password",
    "version": "0.0.1",
    "group": "users",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n\t    \"error\": false,\n    \"mesaage\": \"Password reset link sent\",\n    \"status\": 200,\n    \"data\": [\n        {\n            \"statusCode\": 202,\n            \"headers\": {\n                \"server\": \"nginx\",\n                \"date\": \"Wed, 08 May 2019 22:02:12 GMT\",\n                \"content-length\": \"0\",\n                \"connection\": \"close\",\n                \"x-message-id\": \"FyUP5C_YTaOZo2StbzhppA\",\n                \"access-control-allow-origin\": \"https://sendgrid.api-docs.io\",\n                \"access-control-allow-methods\": \"POST\",\n                \"access-control-allow-headers\": \"Authorization, Content-Type, On-behalf-of, x-sg-elas-acl\",\n                \"access-control-max-age\": \"600\",\n                \"x-no-cors-reason\": \"https://sendgrid.com/docs/Classroom/Basics/API/cors.html\"\n            },\n            \"request\": {\n                \"uri\": {\n                    \"protocol\": \"https:\",\n                    \"slashes\": true,\n                    \"auth\": null,\n                    \"host\": \"api.sendgrid.com\",\n                    \"port\": 443,\n                    \"hostname\": \"api.sendgrid.com\",\n                    \"hash\": null,\n                    \"search\": null,\n                    \"query\": null,\n                    \"pathname\": \"/v3/mail/send\",\n                    \"path\": \"/v3/mail/send\",\n                    \"href\": \"https://api.sendgrid.com/v3/mail/send\"\n                },\n                \"method\": \"POST\",\n                \"headers\": {\n                    \"Accept\": \"application/json\",\n                    \"User-agent\": \"sendgrid/6.3.0;nodejs\",\n                    \"Authorization\": \"Bearer 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\",\n                    \"content-type\": \"application/json\",\n                    \"content-length\": 568\n                }\n            }\n        },\n        null\n    ]\n\t}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "\n{\n    \"error\": true,\n    \"mesaage\": \"No email found for this user\",\n    \"status\": 403,\n    \"data\": null\n    }",
          "type": "json"
        }
      ]
    },
    "filename": "app/routes/user.js",
    "groupTitle": "users",
    "name": "PostApiV1UsersForgotpwd"
  },
  {
    "type": "post",
    "url": "/api/v1/users/login",
    "title": "api for user login",
    "version": "0.0.1",
    "group": "users",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n\t    \"error\": false,\n\t    \"message\": \"Login Successfull\",\n\t    \"status\": 200,\n\t    \"data\": [\n\t\t\t\t\t{\n            \"authToken\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6IkxyVERCZG5IWSIsImlhdCI6MTU1NzM1Mjc5MjY3MSwiZXhwIjoxNTU3NDM5MTkyLCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJha1RvZG8iLCJkYXRhIjp7InVzZXJJZCI6IjBnS25qdDdYcSIsImZ1bGxOYW1lIjoiQWthc2giLCJlbWFpbCI6ImE3ODcybW9rQGtvbC5jb20iLCJyZXNldFBhc3N3b3JkVG9rZW4iOiJBT1gzIn19.0x1cXqKaEyhd2QkRB4Vo2a6BlhpE2b5WGRzPZge7dd0\",\n        \"userDetails\": {\n            \"userId\": \"0gKnjt7Xq\",\n            \"fullName\": \"Akash\",\n            \"email\": \"a7872mok@kol.com\",\n            \"resetPasswordToken\": \"AOX3\"\n        }\n\t\t\t\t\t}\n\t    \t\t]\n\t    \t}\n\t\t}\n\t}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "\n{\n\t    \"error\": true,\n\t    \"message\": \"Wrong Password. Login Failed\",\n\t    \"status\": 403,\n\t    \"data\": null\n\t   }",
          "type": "json"
        }
      ]
    },
    "filename": "app/routes/user.js",
    "groupTitle": "users",
    "name": "PostApiV1UsersLogin"
  },
  {
    "type": "post",
    "url": "/api/v1/users/logout",
    "title": "api for user logout",
    "version": "0.0.1",
    "group": "users",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n   \"error\": false,\n   \"mesaage\": \"Successfully logged out\",\n   \"status\": 200,\n   \"data\": null\n     }",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "\n{\n    \"error\": true,\n    \"mesaage\": \"Invalid Or Expired AuthorizationKey\",\n    \"status\": 511,\n    \"data\": null\n    }",
          "type": "json"
        }
      ]
    },
    "filename": "app/routes/user.js",
    "groupTitle": "users",
    "name": "PostApiV1UsersLogout"
  },
  {
    "type": "post",
    "url": "/api/v1/users/register",
    "title": "api for user signup",
    "version": "0.0.1",
    "group": "users",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n\t    \"error\": false,\n\t    \"message\": \"User Created\",\n\t    \"status\": 200,\n\t    \"data\": [\n\t\t\t\t\t{\n\t\t\t\t\t\tuserId: \"string\",\n\t\t\t\t\t\tfullName: \"string\",\n\t\t\t\t\t\temail: \"string\",\n\t\t\t\t\t\tpassword: \"string\",\n\t\t\t\t\t\tresetPasswordToken: \"string\",\n\t\t\t\t\t\tcreatedOn: \"date\",\n\t\t\t\t\t}\n\t    \t\t]\n\t    \t}\n\t\t}\n\t}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "\n{\n\t    \"error\": true,\n\t    \"message\": \"Failed To Create User\",\n\t    \"status\": 500,\n\t    \"data\": null\n\t   }",
          "type": "json"
        }
      ]
    },
    "filename": "app/routes/user.js",
    "groupTitle": "users",
    "name": "PostApiV1UsersRegister"
  }
] });
