# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Node.js + Express (real-time backend)

## Backend notification service

This project now uses a sibling `backend/` folder alongside `frontend/` for the role-based, event-driven notification system.

### Setup

```sh
cd ../backend
npm install
cp .env.example .env # update MongoDB + client origins as needed
npm run dev # starts Express + Socket.IO on port 5000
```

### Frontend → Backend connection

Create a `.env` file in the project root and point the React app to the backend:

```
VITE_API_BASE_URL=http://localhost:5000
```

### Key endpoints

- `GET /api/notifications` – list notifications for the authenticated role
- `PUT /api/notifications/:id/read` – toggle read state
- `PUT /api/notifications/read-all` – mark all as read
- `DELETE /api/notifications/clear` – clear notifications for the role
- `POST /api/complaints` – create complaint + trigger notifications
- `PUT /api/complaints/:id/status` – emits status updates
- `POST /api/complaints/:id/ai-processed` – emits AI alerts
- `POST /api/complaints/:id/feedback` – emits feedback alerts
- `POST /api/complaints/:id/escalate` – emits escalation alerts
- `POST /api/complaints/authority/signup` – notifies admins of authority signups
- `POST /api/complaints/authority/:id/approve` – notifies authorities of approvals

Every request must include `x-user-role` and (for citizen/authority) `x-user-id` headers.

### Real-time updates

Socket.IO is enabled on the backend and the frontend listens for the `new-notification` event to add notifications without polling.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
