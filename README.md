# Split-n-share
## Your solution to group-buying.

Many online shopping platforms offer bulk discounts or sell items exclusively in large quantities, making it difficult for individuals to save money without facing logistical and financial challenges. To address this, Split-n’-Share enables KAIST students to share the cost and quantity of bulk purchases collaboratively, simplifying access to discounts while avoiding the hassle of managing excess quantity.

Split-n’-Share allows KAIST students to 

- Discover ongoing group-buying opportunities.

- Create or join group purchases to benefit from bulk discounts.

- Communicate with other participants to coordinate purchases and delivery.

- Manage and keep track deals and cobuyers

## Code Overview

- **Backend (`backend/`)**: Implements the server-side functionality to handle user authentication, group management, and data storage.
  - **`server.ts` (`backend/src/server.ts`)**: The entry point of the backend. Responsible for connecting to MongoDB, establishing web sockets and starting the server.
  - **`app.ts` (`backend/src/app.ts`)**: Configure everything related to the Express application.
  - **`controllers/` (`backend/src/controllers/`)**: Handle the application request and interact with the database models.
  - **`routes/` (`backend/src/routes/`)**: Guide the request to the correct handler function in one of the controllers.
  - **`models/` (`backend/src/models/`)**: Define models in the database.
- **Frontend (`frontend/`)**: Handles the user interface for interacting with the platform, allowing users to join groups, track orders, and communicate.
  - **`app.tsx` (`frontend/src/app.tsx`)**: The entry point of the frontend.
  - **`config/` (`frontend/config/`)**: Configures everything related to the frontend application.
  - **`pages/` (`frontend/src/pages/`)**: Defines the pages of the web application. e.g. `frontend/src/pages/browse/products` defines the `/browse/products` page of the website, and `frontend/src/pages/products` defines the `/products/<productId>` pages of the website.

## Setup

First, clone the project to your own machine.

```bash
git clone https://github.com/Casheeew/split-n-share
```

To run the project, first `cd` into the `frontend/` directory and follow the instructions in the README of that directory. 

Similarly, to run the backend, `cd` into `backend/` directory and follow the instructions in the README of that directory.

## Contributing

If you have trouble using git, you can refer to [this nice document](https://github.com/Kuuuube/Misc_Scripts/blob/main/notes/how_to_manage_a_forked_repo/readme.md).
