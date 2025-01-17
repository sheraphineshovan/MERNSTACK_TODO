// src/components/Todo.js
import React, { useState, useEffect } from 'react';

function Todo() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [matrix, setMatrix] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [todos, setTodos] = useState([]);
    const [edit, setEdit] = useState(null);
    const apiUrl = 'http://localhost:5000';

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            getItems(userId);
        }
    }, []);

    const getItems = async (userId) => {
        try {
            const response = await fetch(`${apiUrl}/todo/${userId}`);
            if (!response.ok) throw new Error('Failed to fetch todos');
            const data = await response.json();
            setTodos(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSubmit = async () => {
        const userId = localStorage.getItem('userId');
        if (title.trim() && description.trim() && dueDate && matrix && userId) {
            try {
                const response = await fetch(`${apiUrl}/todo`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, description, dueDate, matrix, userId }),
                });

                if (response.ok) {
                    const newTodo = await response.json();
                    setTodos([...todos, newTodo]);
                    setMessage('Item Added Successfully');
                    setTitle('');
                    setDescription('');
                    setDueDate('');
                    setMatrix('');
                } else {
                    throw new Error('Unable to add Item');
                }
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Sure you want to delete?')) {
            try {
                const response = await fetch(`${apiUrl}/todo/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setTodos(todos.filter((todo) => todo._id !== id));
                } else {
                    throw new Error('Unable to delete Item');
                }
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleUpdate = async () => {
        const userId = localStorage.getItem('userId');
        if (edit && title.trim() && description.trim() && dueDate && matrix && userId) {
            try {
                const response = await fetch(`${apiUrl}/todo/${edit}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, description, dueDate, matrix, userId }),
                });

                if (response.ok) {
                    const updatedTodo = await response.json();
                    setTodos(todos.map((todo) => (todo._id === edit ? updatedTodo : todo)));
                    setMessage('Item Updated Successfully');
                    setEdit(null);
                    setTitle('');
                    setDescription('');
                    setDueDate('');
                    setMatrix('');
                } else {
                    throw new Error('Unable to update Item');
                }
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const getMatrixColor = (matrix) => {
        switch (matrix) {
            case 'Urgent & Important':
                return 'bg-danger'; // Red
            case 'Urgent but Not Important':
                return 'bg-warning'; // Yellow
            case 'Not Urgent but Important':
                return 'bg-primary'; // Blue
            case 'Not Urgent & Not Important':
                return 'bg-secondary'; // Grey
            default:
                return 'bg-light'; 
        }
    }

    return (
        <>
            <div className="row bg-dark text-light p-3  ">
                <div className="d-flex align-items-center justify-content-center w-100 p-2">
                <h3 className=''>Taskify</h3>
                </div>
            </div>

            <div className="row p-3" >
                <h3 className="text-light">Add Item</h3>
                {message && <p className="text-success">{message}</p>}
                {error && <p className="text-danger">{error}</p>}
                <div className="form-group flex">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        className="form-control mb-3"
                    />
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                        className="form-control mb-3"
                    />
                    <input
                        type="datetime-local"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="form-control mb-3"
                    />
                    <select
                        value={matrix}
                        onChange={(e) => setMatrix(e.target.value)}
                        className="form-control mb-3"
                    >
                        <option value="">Select Matrix</option>
                        <option value="Urgent & Important">Urgent & Important</option>
                        <option value="Urgent but Not Important">Urgent but Not Important</option>
                        <option value="Not Urgent but Important">Not Urgent but Important</option>
                        <option value="Not Urgent & Not Important">Not Urgent & Not Important</option>
                    </select>
                    <button onClick={edit ? handleUpdate : handleSubmit} className="btn btn-primary w-100">
                        {edit ? 'Update' : 'Add'}
                    </button>
                </div>
            </div>

            <div className="row mt-3 p-3">
                <h3 className="text-light">Task List</h3>
                <ul className="list-group p-3">
                    {todos.map((todo, index) => (
                        <li key={todo._id} className="list-group-item bg-dark text-light">
                            <div className="d-flex align-items-center">
                            <div
                             className={`rounded-circle ${getMatrixColor(todo.matrix)} me-2`}
                            style={{ width: '15px', height: '15px' }} // Circle size
                            ></div>
                                <h5
                                    className="p-2 rounded w-100"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#collapse-${todo._id}`}
                                    aria-expanded="false"
                                    aria-controls={`collapse-${todo._id}`}
                                >
                                    <strong>{todo.title}</strong>
                                    <span className="badge bg-secondary ms-2">{todo.matrix}</span>
                                    
                                    {/* Matrix Indicator Circle */}
                                    {/* <div
                                        className={`rounded-circle ${getMatrixColor(todo.matrix)} ms-2`}
                                        style={{ width: '15px', height: '15px' }}
                                    ></div> */}
                                </h5>
                            </div>

                           
                            <div
                                id={`collapse-${todo._id}`}
                                className="collapse mt-2"
                                aria-labelledby={`heading-${todo._id}`}
                                data-bs-parent="#todoListAccordion"
                            >
                                <div className="card-body">
                                    <p>{todo.description}</p>
                                    <p><strong>Due Date:</strong> {new Date(todo.dueDate).toLocaleString()}</p>

                                    
                                    <div>
                                        <button
                                            onClick={() => { setEdit(todo._id); setTitle(todo.title); setDescription(todo.description); setDueDate(todo.dueDate); setMatrix(todo.matrix); }}
                                            className="btn btn-warning btn-sm me-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(todo._id)}
                                            className="btn btn-danger btn-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default Todo;
