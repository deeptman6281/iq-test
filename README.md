# iq-test

IQ test web app with paid certificate unlock using Razorpay Checkout + backend verification.

## Run Locally

1. Install dependencies:
```bash
npm install
```

2. Create env file for backend:
```bash
copy .env.example .env
```
Set live values in `.env`:
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- Optional: `CERTIFICATE_AMOUNT_PAISE`, `CERTIFICATE_CURRENCY`, `PORT`, `FRONTEND_ORIGIN`

3. Start backend (payment verification API):
```bash
npm run server
```

4. In another terminal, start frontend:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173` and backend on `http://localhost:8787`.

## Frontend API Config (Important for Production)

The frontend reads `VITE_API_BASE_URL`:
- Local same-origin proxy style: leave it empty (default) and call `/api/...`
- Separate backend domain: set `VITE_API_BASE_URL=https://api.yourdomain.com`

Example `.env` for frontend build:
```bash
VITE_API_BASE_URL=https://api.yourdomain.com
```

## Razorpay Webhook Setup

Create a webhook in Razorpay dashboard:
- URL: `https://<your-domain>/api/razorpay/webhook`
- Secret: same value as `RAZORPAY_WEBHOOK_SECRET`
- Events:
  - `payment.captured`
  - `order.paid`

## Security Notes

- Certificate unlock is set only after server-side payment verification.
- Verification checks Razorpay signature + payment fetch validation (order, amount, currency, captured status).
- Do not expose `RAZORPAY_KEY_SECRET` or webhook secret in frontend code.
