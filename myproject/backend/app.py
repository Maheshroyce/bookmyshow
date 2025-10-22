from flask import Flask, request, jsonify
from flask_cors import CORS
from models import SessionLocal, User
from sqlalchemy.orm import Session

app = Flask(__name__)
CORS(app)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.route('/api/users', methods=['GET'])
def get_users():
    db: Session = next(get_db())
    users = db.query(User).all()
    return jsonify([{"id": user.id, "name": user.name, "email": user.email} for user in users])

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    db: Session = next(get_db())
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        return jsonify({"id": user.id, "name": user.name, "email": user.email})
    return jsonify({"error": "User not found"}), 404

@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    db: Session = next(get_db())
    new_user = User(name=data['name'], email=data['email'])
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return jsonify({"id": new_user.id, "name": new_user.name, "email": new_user.email}), 201

@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    db: Session = next(get_db())
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.name = data['name']
        user.email = data['email']
        db.commit()
        return jsonify({"id": user.id, "name": user.name, "email": user.email})
    return jsonify({"error": "User not found"}), 404

@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    db: Session = next(get_db())
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        db.delete(user)
        db.commit()
        return jsonify({"message": "User deleted"})
    return jsonify({"error": "User not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
