// Load progress from localStorage on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch competency data from JSON
        const response = await fetch('kpis.json');
        const data = await response.json();

        // Generate HTML for competencies
        const container = document.getElementById('competencies-container');
        data.competencies.forEach(competency => {
            const competencyCard = createCompetencyCard(competency);
            container.appendChild(competencyCard);
        });

        // Load saved states and add event listeners
        initializeCompetencies();
    } catch (error) {
        console.error('Error loading KPI data:', error);
    }
});

// Function to create a competency card element
function createCompetencyCard(competency) {
    const card = document.createElement('div');
    card.className = 'competency-card';
    card.setAttribute('data-competency', competency.id);

    const header = document.createElement('div');
    header.className = 'competency-header';

    const title = document.createElement('h2');
    title.textContent = competency.name;
    header.appendChild(title);

    const badge = document.createElement('span');
    badge.className = 'mastery-badge';
    badge.textContent = 'Mastery: 0/10 pts';
    header.appendChild(badge);

    card.appendChild(header);

    const description = document.createElement('p');
    description.className = 'description';
    description.textContent = competency.description;
    card.appendChild(description);

    const deliverables = document.createElement('div');
    deliverables.className = 'deliverables';

    competency.deliverables.forEach(deliverable => {
        const item = document.createElement('div');
        item.className = 'deliverable-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = deliverable.id;
        checkbox.setAttribute('data-points', deliverable.points);
        item.appendChild(checkbox);

        const contentContainer = document.createElement('div');
        contentContainer.className = 'deliverable-content';

        const titleRow = document.createElement('div');
        titleRow.className = 'deliverable-title-row';

        const label = document.createElement('label');
        label.setAttribute('for', deliverable.id);
        label.textContent = deliverable.title;
        titleRow.appendChild(label);

        const infoIcon = document.createElement('span');
        infoIcon.className = 'info-icon';
        infoIcon.textContent = 'i';
        infoIcon.title = 'Click for more information';
        titleRow.appendChild(infoIcon);

        contentContainer.appendChild(titleRow);

        const subtitle = document.createElement('div');
        subtitle.className = 'deliverable-subtitle';
        subtitle.textContent = deliverable.subtitle;
        contentContainer.appendChild(subtitle);

        // Add click event listener to toggle subtitle
        infoIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            subtitle.classList.toggle('expanded');
        });

        item.appendChild(contentContainer);

        const points = document.createElement('span');
        points.className = 'points';
        points.textContent = `${deliverable.points} pts`;
        item.appendChild(points);

        deliverables.appendChild(item);
    });

    card.appendChild(deliverables);

    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';

    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';

    const progressFill = document.createElement('div');
    progressFill.className = 'progress-fill';
    progressBar.appendChild(progressFill);

    progressContainer.appendChild(progressBar);
    card.appendChild(progressContainer);

    return card;
}

// Function to initialize competencies with saved states
function initializeCompetencies() {
    const cards = document.querySelectorAll('.competency-card');

    cards.forEach(card => {
        const competency = card.getAttribute('data-competency');
        const checkboxes = card.querySelectorAll('input[type="checkbox"]');

        // Load checked states from localStorage
        checkboxes.forEach(checkbox => {
            const id = checkbox.id;
            const isChecked = localStorage.getItem(id) === 'true';
            checkbox.checked = isChecked;
        });

        // Update badge and progress
        updateBadge(card);
    });
}

// Function to update the mastery badge for a card
function updateBadge(card) {
    const checkboxes = card.querySelectorAll('input[type="checkbox"]');
    const badge = card.querySelector('.mastery-badge');
    const progressFill = card.querySelector('.progress-fill');
    let totalPoints = 0;

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            totalPoints += parseInt(checkbox.getAttribute('data-points'));
        }
    });

    badge.textContent = `Mastery: ${totalPoints}/10 pts`;
    progressFill.style.width = (totalPoints / 10) * 100 + '%';
}

// Event listener for checkbox changes
document.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') {
        const id = e.target.id;
        const isChecked = e.target.checked;

        // Save to localStorage
        localStorage.setItem(id, isChecked);

        // Update badge for the card
        const card = e.target.closest('.competency-card');
        updateBadge(card);
    }
});
