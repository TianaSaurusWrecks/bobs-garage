Bob's Garage API Documentation

1. Overview
The Bob's Garage API provides access to services, staff, images, user accounts, user preferences and customer favourites.

The API was developed using Node.js, Express and MySQL.

2. Authentication
Some endpoints require authentication using a JSON Web Token (JWT). To access a protected endpoint, include the token in the request header. 

Authorization: Bearer <your_token>

Admin-only endpoints require the authenticated user to have an admin role. 

3. HTTP Status Codes

200 OK                          Request completed successfully
201 Created                     A new resource was created
400 Bad Request                 Request data is invalid
401 Unauthorised                Authentication is required or invalid
403 Forbidden                   User does not have permission
404 Not Found                   Requested resource was not found
409 Conflict                    Resource conflicts with existing data
500 Internal Server Error       An unexpected server error occurred


API Endpoints
The following sections describe the available API endpoints

4. Services
The Services endpoints allow users to view available garage services. Admin can create, update and delete service records.

GET         /services       Retrieve all services               Public
GET         /services/:id   Retrieve a service by ID            Public
POST        /services       Create a new service                Admin
PUT         /services/:id   Update an existing service          Admin
DELETE      /services/:id   Delete a service                    Admin

5. Staff
The Staff endpoints allow users to view information about garage staff. Admin can create, update and delete staff records.

GET         /staff          Retrieve all staff members          Public
GET         /staff/:id      Retrieve a staff member by ID       Public
POST        /staff          Create a new staff member           Admin
PUT         /staff/:id      Update an existing staff member     Admin
DELETE      /staff/:id      Delete a staff member               Admin

6. Images
The Images endpoints allow users to retrieve image records. Admin can create, update and delete image records.

GET         /images         Retrieve all image records          Public
GET         /images/:id     Retrieve an image by ID             Public
POST        /images         Create a new image record           Admin
PUT         /images/:id     Update an existing image record     Admin
DELETE      /images/:id     Delete an image record              Admin

7. User Accounts
The User Accounts endpoints allow users to register, log in and manage their profiles. Admin can view and manage user accounts.

POST         /users/register     Register a new user             Public
POST         /users/login        Log in and get a JWT            Public
GET          /users/profile      Retrieve your profile           Authenticated
PUT          /users/profile      Update your profile             Authenticated
GET          /users              Retrieve all users              Admin
GET          /users/:id          Retrieve user by ID             Admin
DELETE       /users/:id          Delete a user account           Admin

8. User Preferences
The User Preferences endpoints allow authenticated users to retrieve and update their own preferences.

GET          /preferences        Retrieve your preferences           Authenticated
PUT          /preferences        Update your preferences             Authenticated

9. Favourites
The Favourites endpoints allow authenticated users to view, add and remove services from their own favourites.

GET          /favourites         Retrieve your favourites            Authenticated
POST         /favourites         Add a service to favourites         Authenticated
DELETE       /favourites/:id     Delete a service from favourites    Authenticated