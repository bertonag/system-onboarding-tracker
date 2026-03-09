from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({"service": "auth-service", "status": "healthy"})

if __name__ == '__main__':
    app.run(port=5001, debug=True)