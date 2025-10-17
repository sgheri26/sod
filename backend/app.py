import os
import logging
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError

from db import Base, engine, get_session
from models import Todo

load_dotenv()

logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"))
app = Flask(__name__)
CORS(app)

def init_db():
    try:
        Base.metadata.create_all(bind=engine)
        app.logger.info("DB initialized.")
    except Exception:
        app.logger.exception("DB init failed")

init_db()

@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})

@app.get("/api/todos")
def list_todos():
    with get_session() as db:
        todos = db.execute(select(Todo)).scalars().all()
        return jsonify([{"id": t.id, "title": t.title, "completed": t.completed} for t in todos])

@app.post("/api/todos")
def create_todo():
    data = request.get_json() or {}
    title = data.get("title", "").strip()
    if not title:
        return jsonify({"error": "title is required"}), 400
    with get_session() as db:
        todo = Todo(title=title, completed=False)
        db.add(todo)
        try:
            db.commit()
            db.refresh(todo)
        except SQLAlchemyError:
            db.rollback()
            return jsonify({"error": "db_error"}), 500
        return jsonify({"id": todo.id, "title": todo.title, "completed": todo.completed}), 201

@app.put("/api/todos/<int:todo_id>")
def update_todo(todo_id: int):
    data = request.get_json() or {}
    with get_session() as db:
        todo = db.get(Todo, todo_id)
        if not todo:
            return jsonify({"error": "not_found"}), 404
        if "title" in data:
            title = (data.get("title") or "").strip()
            if not title:
                return jsonify({"error": "title cannot be empty"}), 400
            todo.title = title
        if "completed" in data:
            todo.completed = bool(data.get("completed"))
        try:
            db.commit()
            db.refresh(todo)
        except SQLAlchemyError:
            db.rollback()
            return jsonify({"error": "db_error"}), 500
        return jsonify({"id": todo.id, "title": todo.title, "completed": todo.completed})

@app.delete("/api/todos/<int:todo_id>")
def delete_todo(todo_id: int):
    with get_session() as db:
        todo = db.get(Todo, todo_id)
        if not todo:
            return jsonify({"error": "not_found"}), 404
        try:
            db.delete(todo)
            db.commit()
        except SQLAlchemyError:
            db.rollback()
            return jsonify({"error": "db_error"}), 500
        return jsonify({"status": "deleted", "id": todo_id})

if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=True)
