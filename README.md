# Yunique Fashion Store - Yuno Payment Integration

This project demonstrates a full-stack integration of the **Yuno SDK (Full Version)** into a custom checkout flow for "Yunique Fashion Store". It consists of a **Python Flask backend** for handling secure API communication and a **React (Vite) frontend** for the user interface.

## 🚀 Features

- **Full Payment Flow**: End-to-end credit card payment processing using Yuno's High Performance SDK.
- **Secure Backend**: Flask server handles sensitive operations like creating checkout sessions and processing payments.
- **Modern Frontend**: React-based UI with a polished, responsive checkout experience.
- **Embedded Checkout**: Seamlessly embedded payment form using Yuno's `renderMode: 'element'`.

## 🛠️ Prerequisites

- **Python** 3.x
- **Node.js** (v16 or higher)
- **Yuno Account**: You need a `public-api-key`, `private-secret-key`, and `account-code` from the Yuno Dashboard.

## 📂 Project Structure

```
├── backend/            # Flask server
│   ├── app.py          # Main application logic
│   ├── .env            # Environment variables (API Keys)
│   └── requirements.txt # Python dependencies
│
└── frontend/           # React application
    ├── src/
    │   ├── components/
    │   │   └── Checkout.jsx  # Main checkout component with Yuno SDK
    │   └── App.jsx     # Main layout
    └── ...
```

## ⚙️ Setup Instructions

### 1. Backend Setup

The backend communicates with Yuno's API to create sessions and process payments securely.

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2.  Create a virtual environment (optional but recommended):
    ```bash
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # Mac/Linux
    source venv/bin/activate
    ```

3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure Credentials**:
    Open the `.env` file and update it with your Yuno credentials:
    ```ini
    ACCOUNT_CODE=your_account_code
    PUBLIC_API_KEY=your_public_api_key
    PRIVATE_SECRET_KEY=your_private_secret_key
    ```

5.  Run the server:
    ```bash
    python app.py
    ```
    The server will start on `http://localhost:8080`.

### 2. Frontend Setup

The frontend renders the payment form and interacts with the user.

1.  Open a new terminal and navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```
    The application will run on `http://localhost:5173` (or similar).

## 💳 Usage

1.  Open your browser and go to the frontend URL (e.g., `http://localhost:5173`).
2.  Click **"Go to Checkout"** on the home screen.
3.  The Yuno SDK will initialize and ensure the secure environment is ready.
4.  Enter test credit card details (refer to Yuno documentation for test cards).
5.  Click **"Pay Now"** to complete the transaction.

## 🐛 Troubleshooting

- **401 Unauthorized**: Ensure your `.env` file in the `backend` folder has the correct API keys.
- **Element doesn't exist**: If you see DOM errors, ensure you are not running the frontend in `React.StrictMode` (disabled by default in this setup to prevent SDK double-mounting).
- **400 Bad Request**: Check the backend console for error details. Often related to missing fields in the `customer_payer` payload or an invalid token.

---
*This project was created for the Yuno Technical Assessment.*