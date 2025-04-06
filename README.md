# 🎮 AayushGame Verse - Game Discovery Platform

A fully responsive front-end web application to discover video games using the RAWG API. Built with React, Redux, React-Bootstrap, Clerk Auth, and Vanilla CSS.

## 📌 Tech Stack

- ⚛️ **React** (Functional Components + Hooks)
- 🧠 **Redux** (State Management)
- 🔐 **Clerk Auth** (Authentication)
- 🎨 **Bootstrap & React-Bootstrap**
- 💅 **Vanilla CSS**

## 📂 Project Features

1. **🏠 Main Page Layout**
   - Header with logo, search bar, and favorites section.
   - Sidebar for filter options including:
     - Category
     - Tags
     - Release Year
     - Popularity
   - Main hero section displaying a grid of game cards with:
     - Game image
     - Description
     - Tags
     - Category
     - Ratings

2. **🧮 Filtering**
   - Dynamic updates to the game list based on selected filters.
   - Loading spinners or skeletons displayed while fetching data.
   - Filters available for:
     - Category
     - Tags
     - Release Year
     - Popularity

3. **🔍 Real-Time Search**
   - Responsive search bar that updates the game list in real time as the user types.

4. **📄 Pagination**
   - Efficient handling of large game lists using pagination for easy navigation.

5. **📘 Game Detail Page**
   - Detailed view of a game when a card is clicked, showing:
     - Game Title
     - Full Description
     - Screenshots
     - Ratings
     - Pricing (if available)
     - System Requirements

6. **🔐 Clerk Authentication**
   - User sign up, login, and logout functionality using Clerk.
   - Access to the favorites section restricted to authenticated users.

7. **❤️ State Management (Redux)**
   - Management of favorite/bookmarked games with features to:
     - Add/Remove games from favorites.
     - Persist favorites across sessions (using local storage or backend).

## 📱 Responsiveness

The application is fully responsive and functions seamlessly across devices (mobile, tablet, desktop).

## 🧑‍💻 Best Practices

- Use functional components and hooks only (no class components).
- Keep code clean, modular, and maintainable.
- Use proper state management across components.
- Organize files with a scalable folder structure.
- Handle edge cases and loading/error states properly.

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/aayushsh2003/AayushGame-Verse.git

# Step 2: Navigate to the project directory.
cd AayushGame-Verse

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

### Edit a File Directly in GitHub

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

### Use GitHub Codespaces

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What Technologies Are Used for This Project?

This project is built with:

- **Vite**: A fast build tool for modern web projects
- **TypeScript**: For type safety and better developer experience
- **React**: A library for building user interfaces
- **Redux**: For state management
- **Bootstrap**: For styling and layout
- **React Router**: For client-side routing
- **ESLint**: For code linting and quality control
- **Prettier**: For code formatting and consistency


## FAQs

### 1. How do I add new dependencies?
Run the following command to add a new dependency:
```sh
npm install <dependency-name>
```

### 2. How do I build the project for production?
Run the following command to create an optimized production build:
```sh
npm run build
```

### 3. Where can I find the production build files?
The production build files will be located in the `dist/` folder.

### 4. How do I report issues or request features?
You can report issues or request features by opening an issue in the GitHub repository.
