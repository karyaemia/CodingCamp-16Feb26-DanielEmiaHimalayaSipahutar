// 1. Ambil Elemen HTML (Sudah disesuaikan dengan ID di HTML lo)
const todoForm = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const dateInput = document.getElementById('date-input');
const timeInput = document.getElementById('time-input');
const categoryInput = document.getElementById('category-input');
const todoList = document.getElementById('todo-list');
const filterStatus = document.getElementById('filter-status');
const sortDate = document.getElementById('sort-date');
const deleteAllBtn = document.getElementById('delete-all');
const currentDayEl = document.getElementById('current-day');
const circularProgress = document.getElementById('circular-progress');
const progressText = document.getElementById('progress-text');

// 2. Tampilkan hari ini di header
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
if (currentDayEl) {
    currentDayEl.innerText = `Today is ${days[new Date().getDay()]}!`;
}

function updateGreeting() {
    const hour = new Date().getHours();
    let greeting = "";

    if (hour < 12) greeting = "Good Morning ☀️";
    else if (hour < 18) greeting = "Good Afternoon 🌤️";
    else greeting = "Good Evening 🌙";

    // Ini bakal ganti tulisan "Welcome, Bro!" lo
    const greetingElement = document.querySelector('h2.text-xl.font-bold');
    if (greetingElement) {
        greetingElement.innerText = greeting;
    }
}

updateGreeting(); 


// 3. Data State
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// 4. Update Lingkaran Progress
function updateProgress() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    // Update Angka
    document.getElementById('progress-text').innerText = `${percentage}%`;

    // Update Lingkaran
    const circle = document.getElementById('progress-circle');
    const circumference = 213.6; // Keliling lingkaran
    const offset = circumference - (percentage / 100) * circumference;
    circle.style.strokeDashoffset = offset;

    // Logika Warna: Merah pas 0% atau ada task belum kelar
    if (total > 0 && percentage === 0) {
        circle.style.stroke = "#ef4444"; // Merah menyala
    } else if (percentage < 100) {
        circle.style.stroke = "#fbbf24"; // Kuning pas proses
    } else if (percentage === 100 && total > 0) {
        circle.style.stroke = "#4ade80"; // Hijau pas kelar semua
    } else {
        circle.style.stroke = "rgba(255,255,255,0.2)"; // Balik redup kalau kosong
    }
}

// 5. Fungsi Render (Menampilkan ke Layar)
function renderTasks() {
    todoList.innerHTML = '';
    
    let filteredTasks = tasks.filter(t => {
        if (filterStatus.value === 'completed') return t.completed;
        if (filterStatus.value === 'pending') return !t.completed;
        return true;
    });

    filteredTasks.sort((a, b) => {
        const dateA = new Date(a.date + 'T' + a.time);
        const dateB = new Date(b.date + 'T' + b.time);
        return sortDate.value === 'newest' ? dateB - dateA : dateA - dateB;
    });

    if (filteredTasks.length === 0) {
    todoList.innerHTML = `
        <div class="flex flex-col items-center justify-center w-full py-20 text-slate-300">
            <span class="text-6xl mb-4 animate-bounce">🍃</span>
            <p class="text-lg font-medium">No tasks found</p>
            <p class="text-sm opacity-60">Enjoy your chill time! ☕</p>
        </div>
    `;
    return;
}

    filteredTasks.forEach(task => {
    const taskItem = document.createElement('div');
    
    taskItem.className = `p-4 bg-white rounded-2xl border border-slate-100 flex gap-4 items-start shadow-sm ${task.completed ? 'opacity-60' : ''} task-item animate-in`;
    
    taskItem.innerHTML = `
        <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${task.id})" class="mt-1.5 cursor-pointer">
        <div class="flex-1">
            <span class="text-[10px] font-bold uppercase px-2 py-1 rounded bg-indigo-50 text-indigo-600">${task.category}</span>
            <h3 class="font-semibold ${task.completed ? 'line-through text-slate-400' : ''}">${task.text}</h3>
            <p class="text-xs text-slate-500 mt-1">🗓️ ${task.date} | ⏰ ${task.time}</p>
        </div>
        <button onclick="deleteTask(${task.id})" class="text-red-400 hover:text-red-600">🗑️</button>
    `;
    todoList.appendChild(taskItem);
});
}

// 6. Simpan & Render
function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    updateProgress();
}

// 7. Event Listeners
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newTask = {
        id: Date.now(),
        text: taskInput.value,
        date: dateInput.value,
        time: timeInput.value,
        category: categoryInput.value,
        completed: false
    };
    tasks.push(newTask);
    todoForm.reset();
    saveAndRender();
});

window.toggleTask = (id) => {
    tasks = tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
    saveAndRender();
};

window.deleteTask = (id) => {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRender();
};

filterStatus.addEventListener('change', renderTasks);
sortDate.addEventListener('change', renderTasks);
deleteAllBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all tasks?')) {
        tasks = [];
        const circle = document.getElementById('progress-circle');
        if (circle) {
            circle.style.stroke = "rgba(255,255,255,0.2)";
        }
        
        saveAndRender(); 
    }
    
});

// Jalankan saat pertama buka
saveAndRender();