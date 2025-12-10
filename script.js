// Animate progress bars on page load
document.addEventListener('DOMContentLoaded', () => {
    const bars = document.querySelectorAll('.bar-fill');
    
    // Reset bars to 0 width
    bars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0';
        
        // Animate to target width
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 100);
    });

    // Add interactive hover effects
    const cards = document.querySelectorAll('.competency-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(-2px)';
        });
    });
});

// Optional: Function to update ratings dynamically
function updateRating(competencyIndex, rating) {
    const cards = document.querySelectorAll('.competency-card');
    if (cards[competencyIndex]) {
        const bar = cards[competencyIndex].querySelector('.bar-fill');
        const percentage = (rating / 5) * 100;
        bar.style.width = percentage + '%';
        bar.setAttribute('data-rating', rating);
    }
}
