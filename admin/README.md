# Admin Panel for Spacey Mission

This directory contains the administrative tools for the Spacey Mission project, separated into a `client` (React frontend) and a `server` (Node.js backend).

## Overview

-   **`client/`**: A React-based single-page application that serves as the admin dashboard. It provides a user interface for administrative tasks. Access to this dashboard is restricted to users with admin privileges.

-   **`server/`**: A Node.js backend service that uses the Firebase Admin SDK. Its primary role is to securely manage user roles, specifically to grant or revoke admin privileges.

## Workflow for Admin Access

The process for a user to gain admin access is as follows:

1.  **Standard User Registration**: A user must first create a standard account through the main Spacey Mission application.

2.  **Admin Promotion (Backend Task)**: An existing administrator uses the `admin/server` tool to grant admin rights to a standard user. This is done by providing the user's email to a secure server endpoint (`/set-admin-claim`), which then sets an `admin: true` custom claim on their Firebase Authentication account. This is a privileged operation that can only be performed from a secure backend environment.

3.  **Admin Dashboard Login**: The promoted user can now log into the `admin/client` application using their regular credentials.

4.  **Access Granted**: The client-side application verifies the user's ID token upon login to check for the `admin: true` custom claim. If the claim is present, the user is granted access to the protected admin dashboard routes. Otherwise, they are denied access.

## Getting Started (For Contributors)

For now, development focus should be on the `admin/client` application. The `admin/server` is a utility for managing roles and is currently maintained separately.

To run the admin client:

1.  Navigate to the `admin/client` directory:
    ```bash
    cd admin/client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

This will launch the admin login page, where you can sign in with credentials that have been granted admin access.