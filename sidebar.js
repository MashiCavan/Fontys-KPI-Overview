// Sidebar functionality
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const trigger = document.getElementById('sidebar-trigger');
    let sidebarTimeout;

    // Show sidebar on trigger hover
    trigger.addEventListener('mouseenter', () => {
        clearTimeout(sidebarTimeout);
        sidebar.classList.add('active');
    });

    // Hide sidebar when mouse leaves both trigger and sidebar
    const hideSidebar = () => {
        sidebarTimeout = setTimeout(() => {
            sidebar.classList.remove('active');
        }, 300);
    };

    trigger.addEventListener('mouseleave', hideSidebar);

    sidebar.addEventListener('mouseenter', () => {
        clearTimeout(sidebarTimeout);
    });

    sidebar.addEventListener('mouseleave', hideSidebar);
});
