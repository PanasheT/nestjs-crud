# NestJS CRUD Application

This is a simple NestJS application that demonstrates how to perform basic CRUD (Create, Read, Update, Delete) operations on various entities such as users, posts, messages, profiles, and conversations. It uses the Factory design pattern to ensure that the codebase is clean and maintainable.

## Features

- Create, read, update, and delete users, posts, messages, profiles, and conversations with ease.
- Codebase that's clean, maintainable, and optimized using the Factory design pattern.
- Swagger documentation to make navigating the API a breeze.

## Getting Started

To get started, follow these steps:

1. Clone the repository to your local machine.
2. Install the dependencies by running `npm install`.
3. Create a `.env` file in the root directory of the project and configure the database connection settings. Use the `.env.example` for reference.
4. Start the application by running `npm run start:dev`. Alternatively, if you're rocking the Nest CLI, you can use the command `nest start --watch`.
5. Use the Swagger documentation to interact with the API.

## API Documentation

The API documentation is generated using Swagger and can be accessed at `http://localhost:3000/api`. From this link, you'll be hit with a GUI that showcases a comprehensive list of all the endpoints, as well as an interface for making local API calls.

## Entities

This application currently uses the following entities:

- **User**: Users can sign up, log in, and access their profiles. They can also create, read, update, and delete their posts and messages.
- **Post**: Users can create, read, update, and delete posts.
- **Message**: Users can send and receive messages. Each message has a sender, a recipient, a subject, and a body.
- **Profile**: Users can create and edit their profiles. Each profile has a username, a profile picture, and a bio.
- **Conversation**: Users can create, and read. Each conversation has one or more messages between two users.

Each of these entities has its own endpoint and can be manipulated using the CRUD operations.

## Factory Design Pattern

The Factory design pattern is used in this application to ensure that the codebase is clean and maintainable. It provides a centralized location for creating new objects, reducing duplication and making it easier to change object creation if needed.

## Conclusion

That's it, folks! I hope that you find this repo helpful in your quest to learn NestJS. If you have any feedback, feel free to make a pull request. Happy coding!
