// Project Overview functionality
document.addEventListener('DOMContentLoaded', () => {
    loadProjectData();
    initializeEventListeners();
});

// Load saved project data from localStorage
function loadProjectData() {
    const savedData = localStorage.getItem('projectOverview');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        // Load basic project info
        if (data.projectName) document.getElementById('project-name').value = data.projectName;
        if (data.projectDescription) document.getElementById('project-description').value = data.projectDescription;
        if (data.startDate) document.getElementById('start-date').value = data.startDate;
        if (data.endDate) document.getElementById('end-date').value = data.endDate;
        
        // Load checkboxes and notes
        if (data.checkboxes) {
            Object.keys(data.checkboxes).forEach(id => {
                const checkbox = document.getElementById(id);
                if (checkbox) {
                    checkbox.checked = data.checkboxes[id];
                }
            });
        }
        
        if (data.notes) {
            Object.keys(data.notes).forEach(id => {
                const checkbox = document.getElementById(id);
                if (checkbox) {
                    const notesField = checkbox.parentElement.querySelector('.notes-field');
                    if (notesField) {
                        notesField.value = data.notes[id];
                    }
                }
            });
        }
        
        // Load next steps
        if (data.nextSteps && data.nextSteps.length > 0) {
            const container = document.getElementById('next-steps-container');
            container.innerHTML = '';
            data.nextSteps.forEach(step => {
                addNextStepItem(step);
            });
        }
    }
}

// Save project data to localStorage
function saveProjectData() {
    const data = {
        projectName: document.getElementById('project-name').value,
        projectDescription: document.getElementById('project-description').value,
        startDate: document.getElementById('start-date').value,
        endDate: document.getElementById('end-date').value,
        checkboxes: {},
        notes: {},
        nextSteps: []
    };
    
    // Save all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        data.checkboxes[checkbox.id] = checkbox.checked;
        
        // Save associated notes
        const notesField = checkbox.parentElement.querySelector('.notes-field');
        if (notesField && notesField.value) {
            data.notes[checkbox.id] = notesField.value;
        }
    });
    
    // Save next steps
    document.querySelectorAll('.next-step-item input[type="text"]').forEach(input => {
        if (input.value.trim()) {
            data.nextSteps.push(input.value);
        }
    });
    
    localStorage.setItem('projectOverview', JSON.stringify(data));
    
    // Show success message
    showNotification('Project progress saved successfully!');
}

// Add a new next step item
function addNextStepItem(value = '') {
    const container = document.getElementById('next-steps-container');
    const item = document.createElement('div');
    item.className = 'next-step-item';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter next step or priority...';
    input.value = value;
    
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = () => item.remove();
    
    item.appendChild(input);
    item.appendChild(removeBtn);
    container.appendChild(item);
}

// Reset form
function resetForm() {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
        localStorage.removeItem('projectOverview');
        location.reload();
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize event listeners
function initializeEventListeners() {
    // Save button
    document.getElementById('save-project').addEventListener('click', saveProjectData);
    
    // Reset button
    document.getElementById('reset-project').addEventListener('click', resetForm);
    
    // Add next step button
    document.getElementById('add-next-step').addEventListener('click', () => addNextStepItem());
    
    // Auto-save on checkbox change
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            saveProjectData();
        });
    });
    
    // Auto-save on text input (debounced)
    let saveTimeout;
    const autoSaveInputs = document.querySelectorAll('input[type="text"], input[type="date"], textarea');
    autoSaveInputs.forEach(input => {
        input.addEventListener('input', () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                saveProjectData();
            }, 1000);
        });
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
