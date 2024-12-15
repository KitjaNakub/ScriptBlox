document.addEventListener('DOMContentLoaded', () => {
    const adminScriptList = document.getElementById('admin-script-list');
    const addScriptForm = document.getElementById('add-script-form');
    const editScriptModal = document.getElementById('edit-script-modal');
    const closeEditModal = document.getElementById('close-edit-modal');
    const editScriptForm = document.getElementById('edit-script-form');

    // ดึงข้อมูลจาก LocalStorage
    let scripts = JSON.parse(localStorage.getItem('scripts')) || [];

    const saveScriptsToLocalStorage = () => {
        localStorage.setItem('scripts', JSON.stringify(scripts));
    };

    const displayAdminScripts = () => {
        adminScriptList.innerHTML = scripts.map(script => `
            <tr>
                <td>${script.id}</td>
                <td>${script.title}</td>
                <td>${script.category}</td>
                <td>
                    <button class="edit-btn" data-id="${script.id}">Edit</button>
                    <button class="delete-btn" data-id="${script.id}">Delete</button>
                </td>
            </tr>
        `).join('');
    };

    // Handle Add Script Form Submit
    addScriptForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newScript = {
            id: scripts.length > 0 ? scripts[scripts.length - 1].id + 1 : 1, // สร้าง ID ถัดไป
            title: document.getElementById('script-title').value,
            description: document.getElementById('script-description').value,
            code: document.getElementById('script-code').value,
            category: document.getElementById('script-category').value
        };

        scripts.push(newScript);
        saveScriptsToLocalStorage();
        displayAdminScripts();
        addScriptForm.reset(); // รีเซ็ตฟอร์ม
    });

    // Handle Edit Button Click
    adminScriptList.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const scriptId = parseInt(e.target.dataset.id);
            const script = scripts.find(s => s.id === scriptId);

            if (script) {
                document.getElementById('edit-script-id').value = script.id;
                document.getElementById('edit-script-title').value = script.title;
                document.getElementById('edit-script-description').value = script.description;
                document.getElementById('edit-script-code').value = script.code;
                document.getElementById('edit-script-category').value = script.category;

                editScriptModal.style.display = 'flex';
            }
        }
    });

    // Handle Delete Button Click
    adminScriptList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const scriptId = parseInt(e.target.dataset.id);
            scripts = scripts.filter(s => s.id !== scriptId);
            saveScriptsToLocalStorage();
            displayAdminScripts();
        }
    });

    // Close Edit Modal
    closeEditModal.addEventListener('click', () => {
        editScriptModal.style.display = 'none';
    });

    // Handle Edit Form Submit
    editScriptForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const scriptId = parseInt(document.getElementById('edit-script-id').value);
        const updatedScript = {
            id: scriptId,
            title: document.getElementById('edit-script-title').value,
            description: document.getElementById('edit-script-description').value,
            code: document.getElementById('edit-script-code').value,
            category: document.getElementById('edit-script-category').value
        };

        const scriptIndex = scripts.findIndex(s => s.id === scriptId);
        if (scriptIndex !== -1) {
            scripts[scriptIndex] = updatedScript;
            saveScriptsToLocalStorage();
            displayAdminScripts();
            editScriptModal.style.display = 'none';
        }
    });

    // แสดง Script ทั้งหมดตอนเริ่มต้น
    displayAdminScripts();

    // Logout Functionality
    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('isAdmin');
        window.location.href = 'login.html'; // เปลี่ยนกลับไปหน้าล็อกอิน
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const feedbackList = document.getElementById('feedback-list');

    const displayFeedbacks = () => {
        const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
        feedbackList.innerHTML = feedbacks.map((f, index) => `
            <div class="feedback-item">
                <div class="feedback-content">
                    <p><strong>Feedback:</strong> ${f.feedback}</p>
                    <small>Received on: ${f.date}</small>
                </div>
                <button class="delete-feedback-btn" data-index="${index}">Delete</button>
            </div>
        `).join('');
    };

    
});
document.addEventListener('DOMContentLoaded', () => {
    const feedbackList = document.getElementById('feedback-list');

    // ฟังก์ชันแสดงฟีดแบ็คทั้งหมด
    const displayFeedbacks = () => {
        const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
        feedbackList.innerHTML = feedbacks.length > 0
            ? feedbacks.map((f, index) => `
                <div class="feedback-item">
                    <div class="feedback-content">
                        <p><strong>Feedback:</strong> ${f.feedback}</p>
                        <small>Received on: ${f.date}</small>
                    </div>
                    <button class="delete-feedback-btn" data-index="${index}">Delete</button>
                </div>
            `).join('')
            : '<p>No feedback available.</p>';
            
    };

    // ฟังก์ชันลบฟีดแบ็ค
    const deleteFeedback = (index) => {
        let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
        feedbacks.splice(index, 1);  // ลบข้อมูล
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
        displayFeedbacks();
    };

    // การจัดการการลบ
    feedbackList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-feedback-btn')) {
            const index = e.target.dataset.index;
            if (confirm("Are you sure you want to delete this feedback?")) {
                deleteFeedback(index);
            }
        }
    });

    // แสดงฟีดแบ็คเมื่อโหลดหน้าเว็บ
    displayFeedbacks();
});

document.addEventListener('DOMContentLoaded', () => {
    const feedbackList = document.getElementById('feedback-list');
    const prevPageBtn = document.getElementById('prev-page-btn');
    const nextPageBtn = document.getElementById('next-page-btn');
    const currentPageDisplay = document.getElementById('current-page');

    let currentPage = 1;
    const itemsPerPage = 5;

    // ฟังก์ชันแสดงฟีดแบ็คในหน้าปัจจุบัน
    const displayFeedbacks = () => {
        const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
        const totalPages = Math.ceil(feedbacks.length / itemsPerPage);

        // คำนวณช่วงข้อมูลที่จะแสดง
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        const currentFeedbacks = feedbacks.slice(startIndex, endIndex);

        feedbackList.innerHTML = currentFeedbacks.length > 0
            ? currentFeedbacks.map((f, index) => `
                <div class="feedback-item">
                    <div class="feedback-content">
                        <p><strong>Feedback:</strong> ${f.feedback}</p>
                        <small>Received on: ${f.date}</small>
                    </div>
                    <button class="delete-feedback-btn" data-index="${startIndex + index}">Delete</button>
                </div>
            `).join('')
            : '<p>No feedback available.</p>';

        currentPageDisplay.textContent = `Page ${currentPage}`;

        // จัดการสถานะปุ่มเปลี่ยนหน้า
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    };

    DOMContentLoaded

    // จัดการปุ่มเปลี่ยนหน้า
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayFeedbacks();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        currentPage++;
        displayFeedbacks();
    });

    // แสดงฟีดแบ็คเมื่อโหลดหน้าเว็บ
    displayFeedbacks();
});
document.addEventListener('DOMContentLoaded', () => {
    const feedbackList = document.getElementById('feedback-list');
    const prevPageBtn = document.getElementById('prev-page-btn');
    const nextPageBtn = document.getElementById('next-page-btn');
    const currentPageDisplay = document.getElementById('current-page');

    let currentPage = 1;
    const itemsPerPage = 5;

    // ฟังก์ชันแสดงฟีดแบ็คในหน้าปัจจุบัน
    const displayFeedbacks = () => {
        const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
        const totalPages = Math.ceil(feedbacks.length / itemsPerPage);

        // คำนวณช่วงข้อมูลที่จะแสดง
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        const currentFeedbacks = feedbacks.slice(startIndex, endIndex);

        feedbackList.innerHTML = currentFeedbacks.length > 0
            ? currentFeedbacks.map((f, index) => `
                <div class="feedback-item">
                    <div class="feedback-content">
                        <p><strong>Feedback:</strong> ${f.feedback}</p>
                        <small>Received on: ${f.date}</small>
                    </div>
                    <button class="delete-feedback-btn" data-index="${startIndex + index}">Delete</button>
                </div>
            `).join('')
            : '<p>No feedback available.</p>';

        currentPageDisplay.textContent = `Page ${currentPage}`;

        // จัดการสถานะปุ่มเปลี่ยนหน้า
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    };

    // จัดการปุ่มเปลี่ยนหน้า
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayFeedbacks();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
        const totalPages = Math.ceil(feedbacks.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayFeedbacks();
        }
    });

    // แสดงฟีดแบ็คเมื่อโหลดหน้าเว็บ
    displayFeedbacks();
});
// ค้นหา element ของ feedback-section
const feedbackSection = document.getElementById('feedback-section');
const editScriptModal = document.getElementById('edit-script-modal'); // สมมติว่า Modal ใช้ id นี้

// Handle Edit Button Click
adminScriptList.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-btn')) {
        const scriptId = parseInt(e.target.dataset.id);
        const script = scripts.find(s => s.id === scriptId);

        if (script) {
            document.getElementById('edit-script-id').value = script.id;
            document.getElementById('edit-script-title').value = script.title;
            document.getElementById('edit-script-description').value = script.description;
            document.getElementById('edit-script-code').value = script.code;
            document.getElementById('edit-script-category').value = script.category;

            // ซ่อน feedback-section
            feedbackSection.style.display = 'none';

            // เปิด Modal
            editScriptModal.style.display = 'flex';
        }
    }
});

// Close Edit Modal
closeEditModal.addEventListener('click', () => {
    // แสดง feedback-section กลับมา
    feedbackSection.style.display = 'block';

    // ปิด Modal
    editScriptModal.style.display = 'none';
});
const displayScripts = (scriptsToShow) => {
    scriptList.innerHTML = scriptsToShow.map(script => `
        <div class="script-item">
            <h3>${script.title}</h3>
            <p class="script-description">
                ${script.description.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>')}
            </p>
            <button class="copy-btn" data-description="${script.description}">Copy Description</button>
            <p><strong>Category:</strong> ${script.category}</p>
            <pre>${script.code}</pre>
        </div>
    `).join('');

    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const description = e.target.getAttribute('data-description');
            navigator.clipboard.writeText(description)
                .then(() => alert('Description copied to clipboard!'))
                .catch(() => alert('Failed to copy description.'));
        });
    });
};
