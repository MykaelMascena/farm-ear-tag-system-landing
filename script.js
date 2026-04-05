// Toggle Navigation Section
function toggleNavSection(button) {
    const items = button.nextElementSibling;
    if (items && items.classList.contains('nav-section-items')) {
        items.classList.toggle('active');
        button.classList.toggle('active');
    }
}

// Navigation
function navigateTo(page) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeNav = document.querySelector(`[data-page="${page}"]`);
    if (activeNav) {
        activeNav.classList.add('active');
    }
    
    // Close sidebar on mobile
    const sidebar = document.querySelector('.sidebar');
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('active');
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Render page content
    renderPageContent(page);
}

function renderPageContent(page) {
    const contentMain = document.querySelector('.content-main');
    let html = '';

    switch(page) {
        case 'dashboard':
            html = renderDashboardPage();
            break;
        case 'animals':
            html = renderAnimalsPage();
            break;
        case 'weight':
            html = renderWeightsPage();
            break;
        case 'vaccines':
            html = renderVaccinesPage();
            break;
        case 'events':
            html = renderEventsPage();
            break;
        case 'insights':
            html = renderInsightsPage();
            break;
        case 'weight-comparison':
            html = renderWeightComparisonPage();
            break;
        case 'profit-simulator':
            html = renderProfitSimulatorPage();
            break;
        case 'producers':
            html = renderProducersPage();
            break;
        case 'clients':
            html = renderClientsPage();
            break;
        case 'suppliers':
            html = renderSuppliersPage();
            break;
        case 'incoming-notes':
            html = renderIncomingNotesPage();
            break;
        case 'sales-contracts':
            html = renderSalesContractsPage();
            break;
        case 'search':
            html = renderSearchPage();
            break;
        case 'reports':
            html = renderReportsPage();
            break;
        case 'alerts':
            html = renderAlertsPage();
            break;
        case 'settings':
            html = renderSettingsPage();
            break;
        case 'profile':
            html = renderProfilePage();
            break;
        case 'nfe-operations':
            html = renderNfeOperationsPage();
            break;
        default:
            html = '<div class="empty-state"><i class="fas fa-inbox"></i><p>Página não encontrada</p></div>';
    }

    contentMain.innerHTML = html;
    
    // Re-attach event listeners for modals
    attachModalListeners();
}

// Dashboard Page
function renderDashboardPage() {
    const animals = db.getAnimals();
    const weights = db.getWeights();
    const vaccines = db.getVaccines();
    const alerts = db.getAlerts();
    
    const totalAnimals = animals.length;
    const totalWeights = weights.length;
    const totalVaccines = vaccines.length;
    const pendingAlerts = alerts.filter(a => a.status !== 'resolved').length;
    
    const avgWeight = weights.length > 0 
        ? (weights.reduce((sum, w) => sum + parseFloat(w.weight || 0), 0) / weights.length).toFixed(2)
        : 0;
    
    return `
        <div class="page-header">
            <h1>Dashboard</h1>
        </div>
        
        <div class="grid-4" style="margin-bottom: 30px;">
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <i class="fas fa-cow"></i>
                </div>
                <div class="stat-content">
                    <h3>${totalAnimals}</h3>
                    <p>Total de Animais</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                    <i class="fas fa-weight"></i>
                </div>
                <div class="stat-content">
                    <h3>${avgWeight} kg</h3>
                    <p>Peso Medio</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                    <i class="fas fa-syringe"></i>
                </div>
                <div class="stat-content">
                    <h3>${totalVaccines}</h3>
                    <p>Vacinacoes</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
                    <i class="fas fa-bell"></i>
                </div>
                <div class="stat-content">
                    <h3>${pendingAlerts}</h3>
                    <p>Alertas</p>
                </div>
            </div>
        </div>
        
        <div class="grid-2">
            <div class="card">
                <h2>Animais Recentes</h2>
                ${animals.length === 0 ? `
                    <div class="empty-state" style="padding: 40px 20px;">
                        <i class="fas fa-inbox"></i>
                        <p>Nenhum animal cadastrado</p>
                    </div>
                ` : `
                    <div class="list-group">
                        ${animals.slice(-5).reverse().map(animal => `
                            <div class="list-item">
                                <div class="list-item-content">
                                    <h4>Brinco #${animal.earTagNumber}</h4>
                                    <p>${animal.breed} - ${animal.batch}</p>
                                </div>
                                <div class="list-item-badge">${animal.sex === 'male' ? 'Macho' : 'Femea'}</div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
            
            <div class="card">
                <h2>Alertas Ativos</h2>
                ${alerts.length === 0 ? `
                    <div class="empty-state" style="padding: 40px 20px;">
                        <i class="fas fa-check-circle"></i>
                        <p>Nenhum alerta ativo</p>
                    </div>
                ` : `
                    <div class="list-group">
                        ${alerts.slice(-5).reverse().map(alert => `
                            <div class="list-item" style="border-left: 4px solid ${alert.type === 'danger' ? '#e74c3c' : alert.type === 'warning' ? '#f39c12' : '#3498db'};">
                                <div class="list-item-content">
                                    <h4>${alert.title}</h4>
                                    <p>${alert.message}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        </div>
    `;
}

function attachModalListeners() {
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// User Menu Toggle
function toggleUserMenu() {
    const userMenu = document.getElementById('userMenu');
    userMenu.classList.toggle('active');
}

// Close user menu when clicking outside
document.addEventListener('click', (e) => {
    const userProfile = e.target.closest('.user-profile');
    const userMenu = document.getElementById('userMenu');
    if (!userProfile && userMenu) {
        userMenu.classList.remove('active');
    }
});

// Logout function
function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        // Clear user session
        localStorage.removeItem('currentUser');
        // Redirect to login or home
        alert('Você saiu com sucesso!');
        location.reload();
    }
}

// Sidebar Toggle
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarToggleMobile = document.getElementById('sidebarToggleMobile');
const sidebar = document.querySelector('.sidebar');

if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

if (sidebarToggleMobile) {
    sidebarToggleMobile.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && 
        !sidebar?.contains(e.target) && 
        !sidebarToggle?.contains(e.target) &&
        !sidebarToggleMobile?.contains(e.target)) {
        sidebar?.classList.remove('active');
    }
});

// Nav items click handler
document.addEventListener('click', (e) => {
    if (e.target.closest('.nav-item')) {
        const page = e.target.closest('.nav-item').getAttribute('data-page');
        if (page) {
            navigateTo(page);
        }
    }
});

// Modal close buttons
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-close')) {
        const modal = e.target.closest('.modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Add sample data first
    addSampleData();
    
    // Set default page
    navigateTo('dashboard');
    
    // Update notification badge
    updateNotificationBadge();
    
    // Show mobile toggle on small screens
    if (window.innerWidth <= 768) {
        sidebarToggleMobile.style.display = 'block';
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            navigateTo('search');
        }
    });
});

function updateNotificationBadge() {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        const unreadCount = db.getUnreadAlerts();
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
}

// Responsive sidebar on resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        sidebar?.classList.remove('active');
        sidebarToggleMobile.style.display = 'none';
    } else {
        sidebarToggleMobile.style.display = 'block';
    }
});

// Add some sample data on first load
function addSampleData() {
    if (db.getAnimals().length === 0) {
        // Add sample animals
        db.addAnimal({
            earTagNumber: '001',
            breed: 'Nelore',
            batch: 'Lote A',
            dateOfBirth: '2023-01-15',
            sex: 'male',
            notes: 'Animal saudável'
        });
        
        db.addAnimal({
            earTagNumber: '002',
            breed: 'Angus',
            batch: 'Lote B',
            dateOfBirth: '2023-02-20',
            sex: 'female',
            notes: 'Pronta para reprodução'
        });
        
        // Add sample weights
        db.addWeight({
            earTagNumber: '001',
            weight: '450',
            notes: 'Peso inicial'
        });
        
        // Add sample vaccines
        db.addVaccine({
            earTagNumber: '001',
            vaccineType: 'Aftosa',
            date: '2024-01-10',
            nextDose: '2024-07-10',
            notes: 'Primeira dose'
        });
        
        // Add sample alert
        db.addAlert({
            title: 'Vacinação Próxima',
            message: 'Animal 001 necessita de vacinação em breve',
            type: 'warning'
        });
    }
}
