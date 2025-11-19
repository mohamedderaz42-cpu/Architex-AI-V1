# Architex - The Future of Design

Architex is a decentralized application (dApp) built on the Pi Network that revolutionizes interior design using AI and blockchain technology.

## 🚀 Features

*   **Room Scanner**: Utilize SLAM technology simulations to capture room dimensions.
*   **AI Design Studio**: Generate 3D visualizations of interior styles.
*   **Marketplace**: Trade eco-friendly materials and NFTs using Pi and ARCHI tokens.
*   **Service Hub**: Hire certified professionals for installation.
*   **DAO Governance**: Vote on platform proposals using staked tokens.
*   **Enterprise Portal**: Bulk procurement and team management for B2B clients.

## 🛠 Tech Stack

*   **Frontend**: React 18, Vite, Tailwind CSS, Lucide React (Icons)
*   **Backend**: Node.js, Express (Serverless ready)
*   **Blockchain**: Pi Network SDK (Sandbox Mode)
*   **Architecture**: Adapter Pattern for API abstraction.

## 📦 Setup & Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file with your Pi Network API Key (Required for Real Payments):
    ```
    PI_API_KEY=your_api_key_here
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```

## 🏗 Architecture & Data Flow

The application uses a centralized **Contract Adapter** (`src/core/api/contract.ts`) to manage all data interactions. 

### Current State (Prototype Mode)
*   **Data Source**: In-memory mock data located in `src/core/api/contract.ts`.
*   **Persistence**: Temporary (refreshes on reload).
*   **Blockchain**: Pi Sandbox (Testnet).

### Roadmap to Production (Mainnet)
To switch this application to production, the following steps are required:

1.  **Database Integration**: 
    *   Replace functions in `src/core/api/contract.ts` to fetch data from a real backend (e.g., Supabase, Firebase, or MongoDB) instead of returning mock arrays.
2.  **Pi Network Mainnet**:
    *   Update `index.html` to set `sandbox: false`.
    *   Ensure `PI_API_KEY` is set in the hosting environment variables.
3.  **Asset Storage**:
    *   Connect image uploads (Proof of Installation) to cloud storage (AWS S3 or IPFS).

## 🚀 Deployment

This project is optimized for deployment on **Vercel** or **Netlify**.

1.  Push the code to a GitHub repository.
2.  Import the project in Vercel.
3.  Add `PI_API_KEY` to Environment Variables.
4.  Deploy.

---
*Built for the Pi Network Hackathon.*
