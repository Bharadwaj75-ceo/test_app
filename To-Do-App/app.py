# app.py

from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# In-memory "database" for simplicity
tasks = [
    {"id": 1, "text": "Learn Flask", "completed": True},
    {"id": 2, "text": "Build a to-do app", "completed": False},
]
next_id = 3


# Serve the main HTML page
@app.route('/')
def index():
    return render_template('index.html')


# API endpoint to get all tasks
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    return jsonify(tasks)


# API endpoint to add a new task
@app.route('/api/tasks', methods=['POST'])
def add_task():
    global next_id
    if not request.json or 'text' not in request.json:
        return jsonify({"error": "Missing 'text' in request body"}), 400

    task = {
        'id': next_id,
        'text': request.json['text'],
        'completed': False
    }
    tasks.append(task)
    next_id += 1
    return jsonify(task), 201


# API endpoint to update a task (e.g., mark as completed)
@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = next((task for task in tasks if task['id'] == task_id), None)
    if task is None:
        return jsonify({"error": "Task not found"}), 404

    task['completed'] = request.json.get('completed', task['completed'])
    return jsonify(task)


# API endpoint to delete a task
@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    global tasks
    task = next((task for task in tasks if task['id'] == task_id), None)
    if task is None:
        return jsonify({"error": "Task not found"}), 404

    tasks = [t for t in tasks if t['id'] != task_id]
    return '', 204  # No content response for successful deletion


if __name__ == '__main__':
    app.run(debug=True)