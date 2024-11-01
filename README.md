# Digital Artist Portfolio Manager

A web application for managing a digital artist's portfolio, built with React and NestJS. This application allows artists to manage their work portfolio with CRUD operations, image uploads, and visibility controls.

## Features

- 🎨 Intuitive UI/UX design
- 📝 Complete CRUD operations for portfolio works
- 🖼️ Image upload functionality
- 🔗 Client link management
- 👁️ Visibility toggle (show/hide works)
- 📱 Fully responsive design
- ✅ Comprehensive testing

## Tech Stack

### Monorepo Management

- Lerna (Monorepo management)
- Yarn Workspaces

### Frontend

- React 18
- TypeScript
- Redux Toolkit (RTK Query)
- React Hook Form
- Zod (validation)
- Tailwind CSS
- Shadcn/ui components
- Vitest (testing)

### Backend

- NestJS
- TypeScript
- File system storage
- Jest (testing)

## Prerequisites

Before you begin, ensure you have installed:

- Node.js (v18 or higher)
- Yarn package manager
- Git

## Installation

1. Clone the repository:

```bash
git clone [your-repository-url]
cd [repository-name]
```

2. Install dependencies using Lerna:

```bash
yarn install    # Install root dependencies
yarn lerna bootstrap  # Install package dependencies
```

3. Create environment files:

Frontend (.env in app/web):

```bash
VITE_BASE_URL=http://localhost:3000
```

4. Start the development servers:

You can start both applications simultaneously using Lerna:

```bash
yarn dev  # Runs lerna run dev
```

Or start them individually:

Backend:

```bash
cd app/server
yarn start:dev
```

Frontend:

```bash
cd app/web
yarn dev
```

## Available Scripts

Root level scripts (run from repository root):

```bash
yarn dev          # Start all packages in development mode
yarn build        # Build all packages
yarn test         # Run tests across all packages
```

## Monorepo Benefits

The Lerna monorepo structure provides several advantages:

- Shared dependencies management
- Consistent versioning across packages
- Simplified development workflow
- Coordinated builds and testing
- Easy cross-package development

## Project Structure

This project uses Lerna for monorepo management, allowing us to maintain multiple packages in a single repository:

```
/
├── package.json          # Root package.json for monorepo management
├── lerna.json           # Lerna configuration
├── app/                 # Packages directory
│   ├── web/            # Frontend application
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── store/
│   │   │   ├── routes/
│   │   │   └── types/
│   │   └── package.json
│   └── server/         # Backend application
│       ├── src/
│       │   ├── projects/
│       │   └── uploads/
│       └── package.json
```

## Testing

Run frontend tests:

```bash
cd app/web
yarn test
```

Run backend tests:

```bash
cd app/server
yarn test
```

## Features in Detail

### Portfolio Management

- Create new portfolio items with images
- Edit existing items
- Delete items
- Toggle visibility status
- View all portfolio items in a responsive grid

### Image Handling

- Upload images for portfolio items
- Supported formats: JPG, PNG, WEBP
- Automatic image storage management

### Client Links

- Add and edit client website links
- Validate URL format
- Direct linking to client websites

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
