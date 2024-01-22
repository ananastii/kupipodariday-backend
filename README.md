# Virtual Wishlists API

KupiPodariDay (Buy-Present-Give) - Backend for wishlist service.
The project was made during the education, while I was I learning how to build Node.js server-side applications using NestJS framework.

## Features
- Registration and authentication. User can provide username, avatar and profile description
- Viewing the gift feed - latest and popular gifts
- Each gift displays its name, cost, current funds raised, a purchase link, and information about interested users
- Adding/editing gifts: users can add new gifts by specifying cost, image link, and purchase website
- Viewing details about their own and other users' gifts
- Creating wishlists with names and descriptions
- Editing own profile
- Viewing other user profiles
- Search for other users by email or username
- Requesting to contribute: users can request to contribute to a gift, with an option to hide the request from other participants.
- Copying gifts of other users to user own profile

## Stack
- PostgreSQL
- TypeORM
- NestJS
- Typescript 
- Node.js
- Postman

## Setup

- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)

### Installation

To get started with this project, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/DorkEMK/kupipodariday-backend.git
   cd kupipodariday-backend

2. **Install dependencies:**

   ```bash
   npm install

### Usage


- **Start the development server:**

  ```bash
  npm run start:dev


- **Build the project:**

  ```bash
  npm run build

- **Start the production server:**

  ```bash
  npm run start:prod


### Development

For development purposes, you can use these commands:

- **Start the development server with debugging:**

  ```bash
  npm run start:debug


- **Format the code:**

  ```bash
  npm run format

