# Architex - The Future of Design

Architex is a decentralized application (dApp) built on the Pi Network that revolutionizes interior design using AI and blockchain technology.

## Features

*   **Room Scanner**: Utilize SLAM technology to capture room dimensions.
*   **AI Design Studio**: Generate 3D visualizations of interior styles.
*   **Marketplace**: Trade eco-friendly materials and NFTs using Pi and ARCHI tokens.
*   **Service Hub**: Hire certified professionals for installation.
*   **DAO Governance**: Vote on platform proposals using staked tokens.

## Tech Stack

*   **Frontend**: React, Vite, Tailwind CSS
*   **Backend**: Node.js, Express (Vercel Serverless Functions)
*   **Blockchain**: Pi Network SDK

## Setup & Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file with your Pi Network API Key (if running locally with backend):
    ```
    PI_API_KEY=your_api_key_here
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```

## Deployment

This project is configured for deployment on **Vercel**.

1.  Push the code to a GitHub repository.
2.  Import the project in Vercel.
3.  Add the `PI_API_KEY` to the Environment Variables in Vercel project settings if connecting to the real Pi Network API.
4.  Deploy.
