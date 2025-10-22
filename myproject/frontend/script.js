const API_BASE = 'http://localhost:5000/api/users';

document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    document.getElementById('userForm').addEventListener('submit', handleFormSubmit);
});

async function loadUsers() {
    try {
        const response = await fetch(API_BASE);
        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function displayUsers(users) {
    const usersList = document.getElementById('usersList');
    usersList.innerHTML = '';
    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.className = 'user';
        userDiv.innerHTML = `
            <div>
                <strong>${user.name}</strong> - ${user.email}
            </div>
            <div>
                <button onclick="editUser(${user.id})">Edit</button>
                <button class="delete" onclick="deleteUser(${user.id})">Delete</button>
            </div>
        `;
        usersList.appendChild(userDiv);
    });
}

async function handleFormSubmit(event) {
    event.preventDefault();
    const userId = document.getElementById('userId').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    const userData = { name, email };

    try {
        if (userId) {
            await fetch(`${API_BASE}/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
        } else {
            await fetch(API_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
        }
        document.getElementById('userForm').reset();
        document.getElementById('userId').value = '';
        loadUsers();
    } catch (error) {
        console.error('Error saving user:', error);
    }
}

function editUser(id) {
    fetch(`${API_BASE}/${id}`)
        .then(response => response.json())
        .then(user => {
            document.getElementById('userId').value = user.id;
            document.getElementById('name').value = user.name;
            document.getElementById('email').value = user.email;
        })
        .catch(error => console.error('Error fetching user:', error));
}

async function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
            loadUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }
}
