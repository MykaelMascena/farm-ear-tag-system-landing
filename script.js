// Navigation
function navigateTo(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Show selected page
    const pageElement = document.getElementById(`${page}-page`);
    if (pageElement) {
        pageElement.classList.add('active');
    } else {
        // If page doesn't exist, render it dynamically
        renderPageContent(page);
    }
    
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
}

function renderPageContent(page) {
    const pageContent = document.querySelector('.page-content');
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

    pageContent.innerHTML = html;
    
    // Re-attach event listeners for modals
    attachModalListeners();
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

// Dashboard Page
function renderDashboardPage() {
    const animals = db.getAnimals();
    const weights = db.getWeights();
    const vaccines = db.getVaccines();
    const unreadAlerts = db.getUnreadAlerts();
    
    const avgWeight = weights.length > 0 ? (weights.reduce((sum, w) => sum + parseFloat(w.weight || 0), 0) / weights.length).toFixed(2) : 0;
    
    return `
        <div class="page-header">
            <h1>Bem-vindo ao Farm PRO!</h1>
            <p>Gerencie sua fazenda de forma eficiente</p>
        </div>

        <!-- Hero Section -->
        <div class="hero-section">
            <img src="https://images.unsplash.com/photo-1500595046891-e51e7dd6d9d9?w=1200&h=400&fit=crop" alt="Fazenda">
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <i class="fas fa-cow"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-label">Total de Animais</div>
                    <div class="stat-value">${animals.length}</div>
                    <div class="stat-change">+${Math.floor(animals.length * 0.1)} Hoje</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                    <i class="fas fa-weight"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-label">Peso Médio</div>
                    <div class="stat-value">${avgWeight} kg</div>
                    <div class="stat-change">+2.5% vs mês</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                    <i class="fas fa-syringe"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-label">Vacinação</div>
                    <div class="stat-value">95%</div>
                    <div class="stat-change">Atualizado</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
                    <i class="fas fa-chart-line"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-label">Lucratividade</div>
                    <div class="stat-value">+18%</div>
                    <div class="stat-change">Este mês</div>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
            <h2>Ações Rápidas</h2>
            <div class="actions-grid">
                <button class="action-btn" onclick="navigateTo('animals')">
                    <i class="fas fa-plus"></i>
                    <span>Adicionar Animal</span>
                </button>
                <button class="action-btn" onclick="navigateTo('weight')">
                    <i class="fas fa-weight"></i>
                    <span>Registrar Peso</span>
                </button>
                <button class="action-btn" onclick="navigateTo('vaccines')">
                    <i class="fas fa-syringe"></i>
                    <span>Vacinar</span>
                </button>
                <button class="action-btn" onclick="navigateTo('events')">
                    <i class="fas fa-calendar"></i>
                    <span>Novo Evento</span>
                </button>
            </div>
        </div>

        <!-- Alerts Section -->
        ${unreadAlerts > 0 ? `
            <div class="card" style="margin-bottom: 20px; border-left: 4px solid var(--warning);">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-exclamation-circle" style="font-size: 20px; color: var(--warning);"></i>
                    <div>
                        <strong>Você tem ${unreadAlerts} alerta(s) não lido(s)</strong>
                        <p style="margin: 5px 0 0 0; color: var(--text-secondary); font-size: 14px;">Clique para visualizar</p>
                    </div>
                    <button class="btn-secondary btn-sm" onclick="navigateTo('alerts')" style="margin-left: auto;">Ver Alertas</button>
                </div>
            </div>
        ` : ''}

        <!-- Recent Activity -->
        <div class="recent-activity">
            <h2>Atividade Recente</h2>
            <div class="activity-list">
                <div class="activity-item">
                    <div class="activity-avatar">JS</div>
                    <div class="activity-content">
                        <div class="activity-title">João Silva verificou ${animals.length} animais</div>
                        <div class="activity-time">5 min atrás</div>
                    </div>
                </div>
                <div class="activity-item">
                    <div class="activity-avatar">AS</div>
                    <div class="activity-content">
                        <div class="activity-title">Ana registrou ${vaccines.length} vacinas</div>
                        <div class="activity-time">2 horas atrás</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Sidebar Toggle
document.getElementById('sidebarToggle')?.addEventListener('click', () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    const sidebar = document.querySelector('.sidebar');
    const toggle = document.getElementById('sidebarToggle');
    
    if (window.innerWidth <= 768 && 
        !sidebar?.contains(e.target) && 
        !toggle?.contains(e.target)) {
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
    // Set default page
    navigateTo('dashboard');
    
    // Update notification badge
    updateNotificationBadge();
    
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
    const sidebar = document.querySelector('.sidebar');
    if (window.innerWidth > 768) {
        sidebar?.classList.remove('active');
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

// Load sample data
addSampleData();
