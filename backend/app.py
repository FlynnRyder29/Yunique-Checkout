import os
import uuid
import requests
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
ACCOUNT_CODE = os.getenv('ACCOUNT_CODE')
PUBLIC_API_KEY = os.getenv('PUBLIC_API_KEY')
PRIVATE_SECRET_KEY = os.getenv('PRIVATE_SECRET_KEY')
SERVER_PORT = 8080

# Determine API URL based on Public Key Prefix
def generate_base_url_api(public_key):
    if not public_key:
        return 'https://api.y.uno' # Default fallback
    
    parts = public_key.split('_')
    prefix = parts[0] if parts else ''
    
    env_suffix_map = {
        'dev': '-dev',
        'staging': '-staging',
        'sandbox': '-sandbox',
        'prod': ''
    }
    
    suffix = env_suffix_map.get(prefix, '')
    return f'https://api{suffix}.y.uno'

API_URL = generate_base_url_api(PUBLIC_API_KEY)

# Helper to create a customer (simulated logic from reference)
def create_customer():
    try:
        url = f"{API_URL}/v1/customers"
        headers = {
            'public-api-key': PUBLIC_API_KEY,
            'private-secret-key': PRIVATE_SECRET_KEY,
            'Content-Type': 'application/json'
        }
        payload = {
            "country": "CO",
            "merchant_customer_id": str(uuid.uuid4()), # Using UUID as random ID
            "first_name": "John",
            "last_name": "Doe",
            "email": "john.doe@y.uno"
        }
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error creating customer: {e}")
        return {"id": "customer_fallback_id"}

# Initialize GLOBAL CUSTOMER_ID on startup (simplification for demo)
# In a real app, this might be per-user or session-based.
# We'll fetch it lazily or just once here for the demo context.
CUSTOMER_ID = None
try:
    if PUBLIC_API_KEY and PRIVATE_SECRET_KEY:
        customer_data = create_customer()
        CUSTOMER_ID = customer_data.get('id')
        print(f"Initialized Customer ID: {CUSTOMER_ID}")
except Exception as e:
    print(f"Failed to initialize customer: {e}")


@app.route('/public-api-key', methods=['GET'])
def get_public_api_key():
    return jsonify({'publicApiKey': PUBLIC_API_KEY})

@app.route('/checkout/sessions', methods=['POST'])
def create_checkout_session():
    country = request.args.get('country', 'CO')
    
    # Simple currency mapping based on country (from reference logic)
    currency_map = {
        'CO': 'COP',
        'BR': 'BRL',
        'CL': 'CLP',
        'MX': 'MXN',
        'PE': 'PEN',
        'EC': 'USD',
        'US': 'USD'
    }
    currency = currency_map.get(country, 'COP')
    
    try:
        url = f"{API_URL}/v1/checkout/sessions"
        headers = {
            'public-api-key': PUBLIC_API_KEY,
            'private-secret-key': PRIVATE_SECRET_KEY,
            'Content-Type': 'application/json'
        }
        
        payload = {
            "account_id": ACCOUNT_CODE,
            "merchant_order_id": str(uuid.uuid4()), # Random order ID
            "payment_description": "Test Payment Flask",
            "country": country,
            "customer_id": CUSTOMER_ID,
            "amount": {
                "currency": currency,
                "value": 2000
            }
        }
        
        response = requests.post(url, json=payload, headers=headers)
        return jsonify(response.json()), response.status_code
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/payments', methods=['POST'])
def process_payment():
    try:
        data = request.json
        checkout_session = data.get('checkoutSession')
        one_time_token = data.get('oneTimeToken')
        country = request.args.get('country', 'CO')
        
        currency_map = { 'CO': 'COP', 'BR': 'BRL', 'US': 'USD' } # Simplified
        currency = currency_map.get(country, 'COP')
        
        url = f"{API_URL}/v1/payments"
        headers = {
            'public-api-key': PUBLIC_API_KEY,
            'private-secret-key': PRIVATE_SECRET_KEY,
            'X-idempotency-key': str(uuid.uuid4()),
            'Content-Type': 'application/json'
        }
        
        payload = {
            "description": "Test Payment Flask",
            "account_id": ACCOUNT_CODE,
            "merchant_order_id": str(uuid.uuid4()),
            "country": country,
            "amount": {
                "currency": currency,
                "value": 2000
            },
            "checkout": {
                "session": checkout_session
            },
            "customer_payer": {
                "id": CUSTOMER_ID,
                "merchant_customer_id": "1",
                "first_name": "John",
                "last_name": "Doe",
                "date_of_birth": "1990-02-28",
                "email": "johndoe@y.uno",
                "nationality": "CO",
                "ip_address": "192.168.123.167",
                "device_fingerprint": "hi88287gbd8d7d782ge",
                "browser_info": {
                    "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9",
                    "accept_header": "true",
                    "color_depth": "15",
                    "screen_height": "2048",
                    "screen_width": "1152",
                    "javascript_enabled": False,
                    "language": "es"
                },
                "document": {
                    "document_number": "351.040.753-97",
                    "document_type": "CI"
                },
                "billing_address": {
                    "address_line_1": "Calle 34 # 56 - 78",
                    "address_line_2": "Apartamento 502, Torre I",
                    "city": "Bogota",
                    "country": country,
                    "state": "Cundinamarca",
                    "zip_code": "111111",
                    "neighborhood": "Barrio 11"
                },
                "shipping_address": {
                    "address_line_1": "Calle 34 # 56 - 78",
                    "address_line_2": "Apartamento 502, Torre I",
                    "city": "Bogota",
                    "state": "Cundinamarca",
                    "zip_code": "111111",
                    "neighborhood": "Barrio 11",
                    "country": "CO"
                },
                "phone": {
                    "country_code": "57",
                    "number": "3132450765"
                }
            },
            "payment_method": {
                "token": one_time_token,
                "vaulted_token": None
            }
        }
        
        response = requests.post(url, json=payload, headers=headers)
        return jsonify(response.json()), response.status_code

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return "OK", 200

if __name__ == '__main__':
    print(f"Starting server on port {SERVER_PORT}...")
    app.run(port=SERVER_PORT, debug=True)
