# Surfboard API

An api to manage surfboards.

## Getting Started

This section is intended for software developers. If you have rights to the repo, simply clone. If not, you may fork and clone the repo.

After you fork, clone, and install dependencies:

```
git clone <clone url>
cd surfboard-api
npm install
```

## Environment Variables

You'll need to create a local **.env** file to store your application's secrets and other configuration values. Follow these steps to generate and store the secrets.

1. `PORT` - Create a `PORT` environment variable. Set the value to an unused port number for your machine.
2. `COUCH_HOSTNAME=https://{user}:{pwd}@{dbhostname}/`
3. `COUCH_DBNAME=surfboards`

**.env** file example:

```
PORT=5000
COUCH_HOSTNAME=https://admin:e324234sasd@jeff.jrscode.cloud/
COUCH_DBNAME=surfboards
```

## Load some test data

Optionally, you can load some test data in your CouchDB database by running `npm run load`. This will take the array of document within **load-data.js** and bulk add them into the database.

```
npm run load
```

## Start the api

Run the following command to start the api on the designated port.

```
npm start
```

## Endpoints

This api allows you to create, read, update, delete and list surfboards.

## Create a surfboard - `POST /boards`

Add a surfboard to the collection surfboards by providing a new board resource in the request body.

The `name`, `category`, `price`, and `sku` properties are required.

**Example**

```
POST /boards

{
    "name": "shred",
    "category": "fish",
    "price": 399.99,
    "sku": "12345"
}
```

### Response 200 OK

Returned when the operation successfully add the surfboard.

```
{
  "ok": true,
  "id": "board_12345",
  "rev": "1-A6157A5EA545C99B00FF904EEF05FD9F"
}
```

### Response 400 Bad request

Returned when the supplied request body is missing or if required fields are missing.

### Response 404 Not Found

The requested resource could not be found. You may be trying to access a record that does not exist, or you may have supplied an invalid URL.

### Response 500 Internal Server Error

An unexpected error has occurred on our side. You should never receive this response, but if you do please let us know and we'll fix it.

## Get a single board by id - `GET /boards/{sku}`

Retrieve a single surfboard resource from the collection of boards. Use the sku to identify a single board.

**Example**

```
GET /boards/12345

{
    "_id": "board_12345",
    "name": "shred",
    "type": "board",
    "category": "fish",
    "price": 399.99,
    "sku": "12345"
}
```

### Response 200 OK

Returned when the operation successfully retrieves the board.

## Update a board - `PUT /boards/{sku}`

Edits a board. Provide the `sku` in the path to identify the board. Provide the updated board in the body of the request.

### Request body

An object representing the board to edit.

**Example**

Update the price of the board to 499.99.

```
PUT /boards/12345

{
    "_id": "board_12345",
    "name": "shred",
    "type": "board",
    "category": "fish",
    "price": 499.99,
    "sku": "12345"
}
```

### Response 200 OK

Returned when the operation successfully edits the board.

## Patch/Update a cat - `PATCH /cats/{id}`

**Example**

Let's update the entire cat resource and increase Felix's age from 10 to 11 years old.

```
PATCH /cats/felix

{
    "age": 11
}
```

## Delete a cat - `DELETE /cats/{id}`

Delete a cat given an id.

**Example**

Let's update the entire cat resource and increase Felix's age from 10 to 11 years old.

```
DELETE /cats/felix
```
