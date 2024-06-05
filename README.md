## Description

This is a project for technical test at YouApp.
Build with [Nest](https://github.com/nestjs/nest), [MongoDB](https://www.mongodb.com) [SocketIO] (https://socket.io)
Served with [Docket](https://www.docker.com/)

## Installation

```bash
$ git clone https://github.com/toriqahmads/youapp-test
$ cd youapp-test
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Use Docker

Adjust the MongoDB host inside `.env.docker` file with `host.docker.internal`

```bash
$ rm rf node_modules
$ docker build -t youapp-test .
$ docker run -d -p 4000:4000 youapp-test
```

Application started and listen at http://localhost:4000

## Use Docker Compose

```bash
$ rm rf node_modules
$ docker-compose build
$ docker-compose up -d
```

Application started and listen at http://localhost:4000

## API Documentation
### HTTP REST API

You can visit http://localhost:4000/api-docs for complete API Documentation (Swagger)
<br>`Cover image uploaded in create/update profile can accessed in /banner/${imagename}`

 1. Register
    - METHOD: `POST`
    - URL: `/api/register`
    - HEADER:
    ```
    Content-Type: application/json
    ```
    - BODY: 
    ```json
    {
      "email": "youapp@youapp.com",
      "username": "youapp",
      "password": "string"
    }
    ```
    - RESPONSE:
    ```json
    {
      "code": 201,
      "success": true,
      "message": "success",
      "data": {
        "email": "youapp@youapp.com",
        "username": "youapp",
        "created_at": "2024-06-05T15:19:51.909Z",
        "updated_at": "2024-06-05T15:19:51.909Z",
        "id": "666082178f0dc0289074a554"
      }
    }
    ```
 2. Login
    - METHOD: `POST`
    - URL: `/api/login`
    - HEADER: 
    ```
    Content-Type: application/json
    ```
    - BODY:
    ```json
    {
      "username_or_email": "youapp",
      "password": "string"
    }
    ```
    - RESPONSE:
    ```json
    {
      "code": 201,
      "success": true,
      "message": "success",
      "data": {
        "user": {
          "email": "youapp@youapp.com",
          "username": "youapp",
          "created_at": "2024-06-05T15:19:51.909Z",
          "updated_at": "2024-06-05T15:19:51.909Z",
          "id": "666082178f0dc0289074a554",
          "profile": {
            "age": null
          }
        },
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NjA4MjE3OGYwZGMwMjg5MDc0YTU1NCIsImVtYWlsIjoieW91YXBwQHlvdWFwcC5jb20iLCJ1c2VybmFtZSI6InlvdWFwcCIsImlhdCI6MTcxNzYwMDkxNSwiZXhwIjoxNzE4MjA1NzE1fQ.vG_BfKyaXJN99o-taGRQZ9t8UHAjuJfB4rsbk-49yQs",
        "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NjA4MjE3OGYwZGMwMjg5MDc0YTU1NCIsImVtYWlsIjoieW91YXBwQHlvdWFwcC5jb20iLCJ1c2VybmFtZSI6InlvdWFwcCIsImlhdCI6MTcxNzYwMDkxNSwiZXhwIjoxNzE4MjkyMTE1fQ.U85K8yRSkej-HIm3ZIds_zitk9BPVIKeh6uNhsxFnM4"
      }
    }
    ```
 3. Create Profile
    - NOTE: Age, Zodiac, Horoscope will calculated automatically if birthday filled
    - METHOD: `POST`
    - URL: `/api/createProfile`
    - HEADER:
    ```
    Authorization: Bearer ${token}
    Content-Type: multipart/form-data
    ```
    - BODY:
    ```
    'display_name=You App' \
    'birthday=1997-06-02' \
    'gender=male' \
    'height=165' \
    'weight=60' \
    'banner=@Landscape-Photography-steps.jpg;type=image/jpeg' \
    'interests=programming,gaming'
    ```
    - RESPONSE:
    ```json
    {
      "code": 201,
      "success": true,
      "message": "success",
      "data": {
        "user": "666082178f0dc0289074a554",
        "display_name": "You App",
        "gender": "male",
        "birthday": "1997-06-02T00:00:00.000Z",
        "horoscope": "gemini",
        "zodiac": "ox",
        "height": 165,
        "weight": 60,
        "cover": "/banner/1e67eb5f-4c05-451a-b75d-3a71604cf2a4.jpg",
        "interests": [
          "programming",
          "gaming"
        ],
        "created_at": "2024-06-05T15:24:39.354Z",
        "updated_at": "2024-06-05T15:24:39.354Z",
        "age": 27,
        "id": "666083378f0dc0289074a55e"
      }
    }
    ```
 4. Get Profile
    - METHOD: `GET`
    - URL: `/api/getProfile`
    - HEADER: 
    ```
    Authorization: Bearer ${token}
    Content-Type: application/json
    ```
    - RESPONSE:
    ```json
    {
      "code": 200,
      "success": true,
      "message": "success",
      "data": {
        "email": "youapp@youapp.com",
        "username": "youapp",
        "created_at": "2024-06-05T15:19:51.909Z",
        "updated_at": "2024-06-05T15:19:51.909Z",
        "profile": {
          "display_name": "You App",
          "gender": "male",
          "birthday": "1997-06-02T00:00:00.000Z",
          "horoscope": "gemini",
          "zodiac": "ox",
          "height": 165,
          "weight": 60,
          "interests": [
            "programming",
            "gaming"
          ],
          "age": 27
        },
        "id": "666082178f0dc0289074a554"
      }
    }
    ```
 5. Update Profile
    - NOTE: Age, Zodiac, Horoscope will calculated automatically if birthday filled
    - METHOD: `PUT`
    - URL: `/api/updateProfile`
    - HEADER:
    ```
    Authorization: Bearer ${token}
    Content-Type: multipart/form-data
    ```
    - BODY:
    ```
    'display_name=You App' \
    'birthday=1997-06-02' \
    'gender=male' \
    'height=165' \
    'weight=60' \
    'banner=@Landscape-Photography-steps.jpg;type=image/jpeg' \
    'interests=programming,gaming'
    ```
    - RESPONSE:
    ```json
    {
      "code": 200,
      "success": true,
      "message": "success",
      "data": {
        "user": "666082178f0dc0289074a554",
        "display_name": "You App",
        "gender": "male",
        "birthday": "1997-06-02T00:00:00.000Z",
        "horoscope": "gemini",
        "zodiac": "ox",
        "height": 165,
        "weight": 60,
        "cover": "/banner/1e67eb5f-4c05-451a-b75d-3a71604cf2a4.jpg",
        "interests": [
          "programming",
          "gaming"
        ],
        "created_at": "2024-06-05T15:24:39.354Z",
        "updated_at": "2024-06-05T15:24:39.354Z",
        "age": 27,
        "id": "666083378f0dc0289074a55e"
      }
    }
    ```
 6. View Messages
    - METHOD: `GET`
    - URL: `/api/viewMessages`
    - HEADER:
    ```
    Authorization: Bearer ${token}
    ```
    - QUERY:
    ```
    page: number (optional)
    limit: number (optional)
    chat_id: string (optional) ID of chat which message belongs to
    from: string (optional) ID of sender
    message: string (optional) filtering message containing a keyword
    ```
    - RESPONSE:
    ```json
    {
      "code": 200,
      "success": true,
      "data": {
        "list": [
          {
            "sender": "666082178f0dc0289074a554",
            "chat": {
              "participants": [
                "666082178f0dc0289074a554",
                "665ad6de39eaf3baf42579c1"
              ],
              "chat_name": null,
              "recipient_id": "666082178f0dc0289074a554_665ad6de39eaf3baf42579c1",
              "is_group": false,
              "id": "66608692f56f13cbd62a394d"
            },
            "body": "test message",
            "type": "text",
            "delivereds": [],
            "reads": [],
            "created_at": "2024-06-05T15:38:58.256Z",
            "updated_at": "2024-06-05T15:38:58.256Z",
            "id": "66608692f56f13cbd62a394d"
          },
          {
            "sender": "666082178f0dc0289074a554",
            "chat": {
              "participants": [
                "666082178f0dc0289074a554",
                "665ad6de39eaf3baf42579c1"
              ],
              "chat_name": null,
              "recipient_id": "666082178f0dc0289074a554_665ad6de39eaf3baf42579c1",
              "is_group": false,
              "id": "66608732f56f13cbd62a3952"
            },
            "body": "test message",
            "type": "text",
            "reply_for_message": "66608692f56f13cbd62a394d",
            "delivereds": [],
            "reads": [],
            "created_at": "2024-06-05T15:41:38.327Z",
            "updated_at": "2024-06-05T15:41:38.327Z",
            "id": "66608732f56f13cbd62a3952"
          },
          {
            "sender": "666082178f0dc0289074a554",
            "chat": {
              "participants": [
                "666082178f0dc0289074a554",
                "665ad6de39eaf3baf42579c1"
              ],
              "chat_name": null,
              "recipient_id": "666082178f0dc0289074a554_665ad6de39eaf3baf42579c1",
              "is_group": false,
              "id": "666087711463ba5244327bbb"
            },
            "body": "test message",
            "type": "text",
            "reply_for_message": "66608692f56f13cbd62a394d",
            "delivereds": [],
            "reads": [],
            "created_at": "2024-06-05T15:42:42.001Z",
            "updated_at": "2024-06-05T15:42:42.001Z",
            "id": "666087711463ba5244327bbb"
          },
          {
            "sender": "666082178f0dc0289074a554",
            "chat": {
              "participants": [
                "666082178f0dc0289074a554",
                "665ad6de39eaf3baf42579c1"
              ],
              "chat_name": null,
              "recipient_id": "666082178f0dc0289074a554_665ad6de39eaf3baf42579c1",
              "is_group": false,
              "id": "666087d58cbd03ced6c9069e"
            },
            "body": "test message",
            "type": "text",
            "reply_for_message": "66608692f56f13cbd62a394d",
            "delivereds": [],
            "reads": [],
            "created_at": "2024-06-05T15:44:21.147Z",
            "updated_at": "2024-06-05T15:44:21.147Z",
            "id": "666087d58cbd03ced6c9069e"
          }
        ],
        "pagination": {
          "total_data": 4,
          "per_page": "10",
          "total_page": 1,
          "current_page": "1",
          "next_page": null,
          "prev_page": null
        }
      }
    }
    ```

 7. Send Messages
    - METHOD: `POST`
    - URL: `/api/sendMessage`
    - HEADER:
    ```
    Authorization: Bearer ${token}
    Content-Type: application/json
    ```
    - BODY:
    ```json
    {
      "body": "test message",
      "type": "text",
      "attachments": [
        "http://attachment.com/a"
      ],
      "reply_for_message": "66608692f56f13cbd62a394d",
      "recipient": "665ad6de39eaf3baf42579c1"
    }
    ```
    - RESPONSE:
    ```json
    {
      "code": 201,
      "success": true,
      "message": "success",
      "data": {
        "chat": {
          "participants": [
            "666082178f0dc0289074a554",
            "665ad6de39eaf3baf42579c1"
          ],
          "chat_name": null,
          "recipient_id": "666082178f0dc0289074a554_665ad6de39eaf3baf42579c1",
          "is_group": false,
          "created_at": "2024-06-05T15:38:58.249Z",
          "updated_at": "2024-06-05T15:38:58.249Z",
          "id": "66608692f56f13cbd62a394b"
        },
        "message": {
          "sender": "666082178f0dc0289074a554",
          "chat": "66608692f56f13cbd62a394b",
          "body": "test message",
          "type": "text",
          "reply_for_message": "66608692f56f13cbd62a394d",
          "attachments": [
            "http://attachment.com/a"
          ],
          "delivereds": [],
          "reads": [],
          "created_at": "2024-06-05T15:44:21.147Z",
          "updated_at": "2024-06-05T15:44:21.147Z",
          "id": "666087d58cbd03ced6c9069e"
        }
      }
    }
    ```
8. View Chats
   - METHOD: `GET`
   - URL: `/api/viewChats`
   - HEADER:
    ```
    Authorization: Bearer ${token}
    ```
   - QUERY:
    ```
    page: number (optional)
    limit: number (optional)
    participants: string array (optional) ID of chat chat participants
    chat_name: string (optional) Name of chat room
    is_group: boolean string (optional) chat is group or personal
    ```
   - RESPONSE:
    ```json
    {
      "code": 200,
      "success": true,
      "data": {
        "list": [
          {
            "participants": [
              "666082178f0dc0289074a554",
              "665ad6de39eaf3baf42579c1"
            ],
            "chat_name": null,
            "is_group": false,
            "created_at": "2024-06-05T15:38:58.249Z",
            "updated_at": "2024-06-05T15:38:58.249Z",
            "id": "66608692f56f13cbd62a394b"
          }
        ],
        "pagination": {
          "total_data": 1,
          "per_page": 25,
          "total_page": 1,
          "current_page": 1,
          "next_page": null,
          "prev_page": null
        }
      }
    }
    ```
