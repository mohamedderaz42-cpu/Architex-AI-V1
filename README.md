# Architex - The Future of Design

Architex is a decentralized application (dApp) built on the Pi Network that revolutionizes interior design using AI and blockchain technology.

## 🚀 Features

*   **Room Scanner**: Utilize SLAM technology simulations to capture room dimensions.
*   **AI Design Studio**: Generate 3D visualizations of interior styles.
*   **Marketplace**: Trade eco-friendly materials and NFTs using Pi and ARCHI tokens.
*   **Service Hub**: Hire certified professionals for installation.
*   **DAO Governance**: Vote on platform proposals using staked tokens.
*   **Enterprise Portal**: Bulk procurement and team management for B2B clients.
*   **🛡️ Private AI (Beta)**: A local Python microservice utilizing OpenMined concepts for privacy-preserving design.

## 🛠 Tech Stack

*   **Frontend**: React 18, Vite, Tailwind CSS, Lucide React (Icons)
*   **Backend (Orchestrator)**: Node.js, Express
*   **Privacy Layer**: Python, FastAPI (Ready for PySyft)
*   **Blockchain**: Pi Network SDK (Sandbox Mode)

## 📦 Setup & Installation

### 1. Frontend & Node Backend
1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```

### 2. (Optional) Privacy Layer Setup
To enable the local AI privacy simulation:

1.  Navigate to the python directory:
    ```bash
    cd backend/python
    ```
2.  Install Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Run the Privacy Service:
    ```bash
    python main.py
    ```
    *The service will run on http://localhost:8000*

## 🏗 Architecture & Data Flow

The application uses a centralized **Contract Adapter** (`src/core/api/contract.ts`) to manage all data interactions. 

### Future Integration: OpenMined (PySyft)
We have prepared a dedicated Python microservice (`backend/python/main.py`) designed to act as a **Domain Node**. When Pi Network officially integrates OpenMined, this service will handle **Federated Learning**, allowing the AI to learn from room designs without the raw images ever leaving the user's device.

## 🚀 Deployment

This project is optimized for deployment on **Vercel** or **Netlify**.

1.  Push the code to a GitHub repository.
2.  Import the project in Vercel.
3.  Add `PI_API_KEY` to Environment Variables.
4.  Deploy.

---
*Built for the Pi Network Hackathon.*