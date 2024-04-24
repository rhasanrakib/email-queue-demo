# Email Queue

## Usage
Node version >= <b>16<b>

### Setup env

In your .env file please include this fields

```json
NODE_ENV = development
APP_PORT = 3001
DB = email_queue
DB_USER = root
DB_PASSWORD = root
DB_HOST= 127.0.0.1
DB_PORT = 3306
MAILTRAP_EMAIL = "use any email"
MAILTRAP_HOST = "mailtrap host"
MAILTRAP_USER = "mailtrap user"
MAILTRAP_PASS = "mailtrap password"
INTERVAL_TIME_IN_MIN = "The system will check retry mail after this certain minutes e.g. 5"

``` 

### Installation
```sh
npm install
npm run migrate
npm run dev

```
### Commands
```json
{
    "For start": "npm run start",  
    "For test": "npm run test", // currently unavailable  
    "For start:dev": "npm run dev",  
    "For seed": "npm run seed",  
    "For migrate": "npm run migrate",  
}
```

### Project structure

Mail-Queue/
├── common/
│   ├── constants.js
│   ├── dayjs.js
│   ├── error-response.js
│   └── success-response.js
├── config/
│   ├── config.json
│   └── env-config.js
├── migrations/
│   └── all migration files
├── models/
│   └── all model files
├── seeders/
│   └── all seed files
└── src/
    ├── customer/
    │   ├── customer.controller.js
    │   ├── customer.service.js
    │   └── mail-event.service.js
    ├── mailtrap/
    │   └── mailtrap.service.js
    └── index.js

## Response Pattern

## Error Response
```json
        "success": "false",
        "message": "A string represent generic message to show the users."
        "errors":[
            {
                "statusCode": "Any custom status code that represent the error code in developer level",
                "message": "More specific error"
            }
        ]
```

## Success Response
```json
        "success": "true",
        "message": "A string represent generic message to show the users."
        "data":[]
```

## Api references

### Register a customer
```bash
curl --location 'http://localhost:3001/customer/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Rakib",
    "email": "nesoh80373@picdv.com",
    "dob": "1996-04-24",
    "message": "Haappy Birthday to you"
}'
```

### Start the mailing service
Though the mailing service will start automatically every 1 hour. If no mail is pending then it will stop. But for starting immediately, you can use thi api

```bash
curl --location --request PATCH 'http://localhost:3001/customer/'
```