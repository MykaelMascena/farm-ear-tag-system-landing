// ============================================
// PÁGINAS E FUNCIONALIDADES
// ============================================

// Animals Page
function renderAnimalsPage() {
    const breeds = db.getBreeds();
    const selectedBreed = document.getElementById('breedSelect')?.value || '';
    const selectedBatch = document.getElementById('batchSelect')?.value || '';
    
    let html = `
        <div class="page-header">
            <h1>Gerenciamento de Animais</h1>
            <button class="btn-primary" onclick="openModal('addAnimalModal')">
                <i class="fas fa-plus"></i> Adicionar Animal
            </button>
        </div>

        <div class="card" style="margin-bottom: 20px;">
            <div class="grid-2">
                <div class="form-group">
                    <label>Raça</label>
                    <select id="breedSelect" onchange="renderAnimalsPage()">
                        <option value="">Selecione uma raça</option>
                        ${breeds.map(b => `<option value="${b}" ${selectedBreed === b ? 'selected' : ''}>${b}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Lote</label>
                    <select id="batchSelect" onchange="renderAnimalsPage()">
                        <option value="">Todos os lotes</option>
                        ${db.getBatches().map(b => `<option value="${b}" ${selectedBatch === b ? 'selected' : ''}>${b}</option>`).join('')}
                    </select>
                </div>
            </div>
        </div>
    `;

    if (!selectedBreed) {
        html += `
            <div class="empty-state">
                <i class="fas fa-cow"></i>
                <h3>Selecione uma raça</h3>
                <p>Escolha uma raça acima para ver os animais</p>
            </div>
        `;
    } else {
        const animals = db.getAnimalsByBreed(selectedBreed).filter(a => 
            !selectedBatch || a.batch === selectedBatch
        );

        if (animals.length === 0) {
            html += `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>Nenhum animal encontrado</h3>
                    <p>Adicione um novo animal para começar</p>
                </div>
            `;
        } else {
            html += `
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Brinco</th>
                                <th>Raça</th>
                                <th>Lote</th>
                                <th>Sexo</th>
                                <th>Data Nascimento</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${animals.map(animal => `
                                <tr>
                                    <td><strong>${animal.earTagNumber}</strong></td>
                                    <td>${animal.breed}</td>
                                    <td>${animal.batch}</td>
                                    <td>${animal.sex === 'male' ? 'Macho' : 'Fêmea'}</td>
                                    <td>${UIManager.formatDate(animal.dateOfBirth)}</td>
                                    <td>
                                        <button class="btn-secondary btn-sm" onclick="editAnimal(${animal.id})">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn-danger btn-sm" onclick="deleteAnimal(${animal.id})">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
    }

    html += `
        <!-- Add Animal Modal -->
        <div id="addAnimalModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Adicionar Animal</h2>
                    <button class="modal-close" onclick="closeModal('addAnimalModal')">×</button>
                </div>
                <form onsubmit="saveAnimal(event)">
                    <div class="form-group">
                        <label>Número do Brinco *</label>
                        <input type="text" id="earTagNumber" required>
                    </div>
                    <div class="form-group">
                        <label>Raça *</label>
                        <select id="animalBreed" required>
                            <option value="">Selecione</option>
                            ${db.getBreeds().map(b => `<option value="${b}">${b}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Lote *</label>
                        <select id="animalBatch" required>
                            <option value="">Selecione</option>
                            ${db.getBatches().map(b => `<option value="${b}">${b}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Data de Nascimento *</label>
                        <input type="date" id="dateOfBirth" required>
                    </div>
                    <div class="form-group">
                        <label>Sexo *</label>
                        <select id="animalSex" required>
                            <option value="male">Macho</option>
                            <option value="female">Fêmea</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Observações</label>
                        <textarea id="animalNotes"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn-secondary" onclick="closeModal('addAnimalModal')">Cancelar</button>
                        <button type="submit" class="btn-primary">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    return html;
}

function saveAnimal(e) {
    e.preventDefault();
    const animal = {
        earTagNumber: document.getElementById('earTagNumber').value,
        breed: document.getElementById('animalBreed').value,
        batch: document.getElementById('animalBatch').value,
        dateOfBirth: document.getElementById('dateOfBirth').value,
        sex: document.getElementById('animalSex').value,
        notes: document.getElementById('animalNotes').value
    };
    db.addAnimal(animal);
    UIManager.showNotification('Animal adicionado com sucesso!');
    closeModal('addAnimalModal');
    renderAnimalsPage();
}

function deleteAnimal(id) {
    if (confirm('Tem certeza que deseja remover este animal?')) {
        db.deleteAnimal(id);
        UIManager.showNotification('Animal removido com sucesso!');
        renderAnimalsPage();
    }
}

// Weights Page
function renderWeightsPage() {
    const weights = db.getWeights();
    
    let html = `
        <div class="page-header">
            <h1>Controle de Pesos</h1>
            <button class="btn-primary" onclick="openModal('addWeightModal')">
                <i class="fas fa-plus"></i> Registrar Peso
            </button>
        </div>
    `;

    if (weights.length === 0) {
        html += `
            <div class="empty-state">
                <i class="fas fa-weight"></i>
                <h3>Nenhum registro de peso</h3>
                <p>Adicione um novo registro para começar</p>
            </div>
        `;
    } else {
        const avgWeight = (weights.reduce((sum, w) => sum + parseFloat(w.weight || 0), 0) / weights.length).toFixed(2);
        
        html += `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                        <i class="fas fa-weight"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Peso Médio</div>
                        <div class="stat-value">${avgWeight} kg</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                        <i class="fas fa-list"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Total de Registros</div>
                        <div class="stat-value">${weights.length}</div>
                    </div>
                </div>
            </div>

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Brinco</th>
                            <th>Peso (kg)</th>
                            <th>Data</th>
                            <th>Observações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${weights.slice().reverse().map(w => `
                            <tr>
                                <td><strong>${w.earTagNumber}</strong></td>
                                <td>${w.weight} kg</td>
                                <td>${UIManager.formatDate(w.date)}</td>
                                <td>${w.notes || '-'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    html += `
        <!-- Add Weight Modal -->
        <div id="addWeightModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Registrar Peso</h2>
                    <button class="modal-close" onclick="closeModal('addWeightModal')">×</button>
                </div>
                <form onsubmit="saveWeight(event)">
                    <div class="form-group">
                        <label>Número do Brinco *</label>
                        <input type="text" id="weightEarTag" required>
                    </div>
                    <div class="form-group">
                        <label>Peso (kg) *</label>
                        <input type="number" id="weightValue" step="0.1" required>
                    </div>
                    <div class="form-group">
                        <label>Observações</label>
                        <textarea id="weightNotes"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn-secondary" onclick="closeModal('addWeightModal')">Cancelar</button>
                        <button type="submit" class="btn-primary">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    return html;
}

function saveWeight(e) {
    e.preventDefault();
    const weight = {
        earTagNumber: document.getElementById('weightEarTag').value,
        weight: document.getElementById('weightValue').value,
        notes: document.getElementById('weightNotes').value
    };
    db.addWeight(weight);
    UIManager.showNotification('Peso registrado com sucesso!');
    closeModal('addWeightModal');
    renderWeightsPage();
}

// Vaccines Page
function renderVaccinesPage() {
    const vaccines = db.getVaccines();
    
    let html = `
        <div class="page-header">
            <h1>Controle de Vacinas</h1>
            <button class="btn-primary" onclick="openModal('addVaccineModal')">
                <i class="fas fa-plus"></i> Registrar Vacina
            </button>
        </div>
    `;

    if (vaccines.length === 0) {
        html += `
            <div class="empty-state">
                <i class="fas fa-syringe"></i>
                <h3>Nenhum registro de vacina</h3>
                <p>Adicione um novo registro para começar</p>
            </div>
        `;
    } else {
        html += `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Brinco</th>
                            <th>Tipo de Vacina</th>
                            <th>Data</th>
                            <th>Próxima Dose</th>
                            <th>Observações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${vaccines.slice().reverse().map(v => `
                            <tr>
                                <td><strong>${v.earTagNumber}</strong></td>
                                <td>${v.vaccineType}</td>
                                <td>${UIManager.formatDate(v.date)}</td>
                                <td>${v.nextDose ? UIManager.formatDate(v.nextDose) : '-'}</td>
                                <td>${v.notes || '-'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    html += `
        <!-- Add Vaccine Modal -->
        <div id="addVaccineModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Registrar Vacina</h2>
                    <button class="modal-close" onclick="closeModal('addVaccineModal')">×</button>
                </div>
                <form onsubmit="saveVaccine(event)">
                    <div class="form-group">
                        <label>Número do Brinco *</label>
                        <input type="text" id="vaccineEarTag" required>
                    </div>
                    <div class="form-group">
                        <label>Tipo de Vacina *</label>
                        <select id="vaccineType" required>
                            <option value="">Selecione</option>
                            ${db.getVaccineTypes().map(v => `<option value="${v}">${v}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Data da Vacinação *</label>
                        <input type="date" id="vaccineDate" required>
                    </div>
                    <div class="form-group">
                        <label>Próxima Dose</label>
                        <input type="date" id="vaccineNextDose">
                    </div>
                    <div class="form-group">
                        <label>Observações</label>
                        <textarea id="vaccineNotes"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn-secondary" onclick="closeModal('addVaccineModal')">Cancelar</button>
                        <button type="submit" class="btn-primary">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    return html;
}

function saveVaccine(e) {
    e.preventDefault();
    const vaccine = {
        earTagNumber: document.getElementById('vaccineEarTag').value,
        vaccineType: document.getElementById('vaccineType').value,
        date: document.getElementById('vaccineDate').value,
        nextDose: document.getElementById('vaccineNextDose').value,
        notes: document.getElementById('vaccineNotes').value
    };
    db.addVaccine(vaccine);
    UIManager.showNotification('Vacina registrada com sucesso!');
    closeModal('addVaccineModal');
    renderVaccinesPage();
}

// Events Page
function renderEventsPage() {
    const events = db.getEvents();
    
    let html = `
        <div class="page-header">
            <h1>Eventos Sanitários</h1>
            <button class="btn-primary" onclick="openModal('addEventModal')">
                <i class="fas fa-plus"></i> Novo Evento
            </button>
        </div>
    `;

    if (events.length === 0) {
        html += `
            <div class="empty-state">
                <i class="fas fa-calendar-alt"></i>
                <h3>Nenhum evento registrado</h3>
                <p>Adicione um novo evento para começar</p>
            </div>
        `;
    } else {
        html += `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Brinco</th>
                            <th>Tipo de Evento</th>
                            <th>Data</th>
                            <th>Observações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${events.slice().reverse().map(e => `
                            <tr>
                                <td><strong>${e.earTagNumber}</strong></td>
                                <td>${e.eventType}</td>
                                <td>${UIManager.formatDate(e.date)}</td>
                                <td>${e.notes || '-'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    html += `
        <!-- Add Event Modal -->
        <div id="addEventModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Novo Evento</h2>
                    <button class="modal-close" onclick="closeModal('addEventModal')">×</button>
                </div>
                <form onsubmit="saveEvent(event)">
                    <div class="form-group">
                        <label>Número do Brinco *</label>
                        <input type="text" id="eventEarTag" required>
                    </div>
                    <div class="form-group">
                        <label>Tipo de Evento *</label>
                        <select id="eventType" required>
                            <option value="">Selecione</option>
                            ${db.getEventTypes().map(e => `<option value="${e}">${e}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Data do Evento *</label>
                        <input type="date" id="eventDate" required>
                    </div>
                    <div class="form-group">
                        <label>Observações</label>
                        <textarea id="eventNotes"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn-secondary" onclick="closeModal('addEventModal')">Cancelar</button>
                        <button type="submit" class="btn-primary">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    return html;
}

function saveEvent(e) {
    e.preventDefault();
    const event = {
        earTagNumber: document.getElementById('eventEarTag').value,
        eventType: document.getElementById('eventType').value,
        date: document.getElementById('eventDate').value,
        notes: document.getElementById('eventNotes').value
    };
    db.addEvent(event);
    UIManager.showNotification('Evento registrado com sucesso!');
    closeModal('addEventModal');
    renderEventsPage();
}

// Producers Page
function renderProducersPage() {
    const producers = db.getProducers();
    
    let html = `
        <div class="page-header">
            <h1>Gerenciamento de Produtores</h1>
            <button class="btn-primary" onclick="openModal('addProducerModal')">
                <i class="fas fa-plus"></i> Novo Produtor
            </button>
        </div>
    `;

    if (producers.length === 0) {
        html += `
            <div class="empty-state">
                <i class="fas fa-user-tie"></i>
                <h3>Nenhum produtor cadastrado</h3>
                <p>Adicione um novo produtor para começar</p>
            </div>
        `;
    } else {
        html += `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>CPF/CNPJ</th>
                            <th>Email</th>
                            <th>Telefone</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${producers.map(p => `
                            <tr>
                                <td><strong>${p.name}</strong></td>
                                <td>${p.cpfCnpj}</td>
                                <td>${p.email}</td>
                                <td>${p.phone}</td>
                                <td>
                                    <button class="btn-secondary btn-sm" onclick="editProducer(${p.id})">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn-danger btn-sm" onclick="deleteProducer(${p.id})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    html += `
        <!-- Add Producer Modal -->
        <div id="addProducerModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Novo Produtor</h2>
                    <button class="modal-close" onclick="closeModal('addProducerModal')">×</button>
                </div>
                <form onsubmit="saveProducer(event)">
                    <div class="form-group">
                        <label>Nome *</label>
                        <input type="text" id="producerName" required>
                    </div>
                    <div class="form-group">
                        <label>CPF/CNPJ *</label>
                        <input type="text" id="producerCpfCnpj" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="producerEmail">
                    </div>
                    <div class="form-group">
                        <label>Telefone</label>
                        <input type="text" id="producerPhone">
                    </div>
                    <div class="form-group">
                        <label>FUNRURAL</label>
                        <input type="text" id="producerFunrural">
                    </div>
                    <div class="form-group">
                        <label>CND</label>
                        <input type="text" id="producerCnd">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn-secondary" onclick="closeModal('addProducerModal')">Cancelar</button>
                        <button type="submit" class="btn-primary">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    return html;
}

function saveProducer(e) {
    e.preventDefault();
    const producer = {
        name: document.getElementById('producerName').value,
        cpfCnpj: document.getElementById('producerCpfCnpj').value,
        email: document.getElementById('producerEmail').value,
        phone: document.getElementById('producerPhone').value,
        funrural: document.getElementById('producerFunrural').value,
        cnd: document.getElementById('producerCnd').value
    };
    db.addProducer(producer);
    UIManager.showNotification('Produtor adicionado com sucesso!');
    closeModal('addProducerModal');
    renderProducersPage();
}

function deleteProducer(id) {
    if (confirm('Tem certeza que deseja remover este produtor?')) {
        db.deleteProducer(id);
        UIManager.showNotification('Produtor removido com sucesso!');
        renderProducersPage();
    }
}

// Clients Page
function renderClientsPage() {
    const clients = db.getClients();
    
    let html = `
        <div class="page-header">
            <h1>Gerenciamento de Clientes</h1>
            <button class="btn-primary" onclick="openModal('addClientModal')">
                <i class="fas fa-plus"></i> Novo Cliente
            </button>
        </div>
    `;

    if (clients.length === 0) {
        html += `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <h3>Nenhum cliente cadastrado</h3>
                <p>Adicione um novo cliente para começar</p>
            </div>
        `;
    } else {
        html += `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>CPF/CNPJ</th>
                            <th>Email</th>
                            <th>Telefone</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${clients.map(c => `
                            <tr>
                                <td><strong>${c.name}</strong></td>
                                <td>${c.cpfCnpj}</td>
                                <td>${c.email}</td>
                                <td>${c.phone}</td>
                                <td>
                                    <button class="btn-secondary btn-sm" onclick="editClient(${c.id})">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn-danger btn-sm" onclick="deleteClient(${c.id})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    html += `
        <!-- Add Client Modal -->
        <div id="addClientModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Novo Cliente</h2>
                    <button class="modal-close" onclick="closeModal('addClientModal')">×</button>
                </div>
                <form onsubmit="saveClient(event)">
                    <div class="form-group">
                        <label>Nome *</label>
                        <input type="text" id="clientName" required>
                    </div>
                    <div class="form-group">
                        <label>CPF/CNPJ *</label>
                        <input type="text" id="clientCpfCnpj" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="clientEmail">
                    </div>
                    <div class="form-group">
                        <label>Telefone</label>
                        <input type="text" id="clientPhone">
                    </div>
                    <div class="form-group">
                        <label>Endereço</label>
                        <input type="text" id="clientAddress">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn-secondary" onclick="closeModal('addClientModal')">Cancelar</button>
                        <button type="submit" class="btn-primary">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    return html;
}

function saveClient(e) {
    e.preventDefault();
    const client = {
        name: document.getElementById('clientName').value,
        cpfCnpj: document.getElementById('clientCpfCnpj').value,
        email: document.getElementById('clientEmail').value,
        phone: document.getElementById('clientPhone').value,
        address: document.getElementById('clientAddress').value
    };
    db.addClient(client);
    UIManager.showNotification('Cliente adicionado com sucesso!');
    closeModal('addClientModal');
    renderClientsPage();
}

function deleteClient(id) {
    if (confirm('Tem certeza que deseja remover este cliente?')) {
        db.deleteClient(id);
        UIManager.showNotification('Cliente removido com sucesso!');
        renderClientsPage();
    }
}

// Suppliers Page
function renderSuppliersPage() {
    const suppliers = db.getSuppliers();
    
    let html = `
        <div class="page-header">
            <h1>Gerenciamento de Fornecedores</h1>
            <button class="btn-primary" onclick="openModal('addSupplierModal')">
                <i class="fas fa-plus"></i> Novo Fornecedor
            </button>
        </div>
    `;

    if (suppliers.length === 0) {
        html += `
            <div class="empty-state">
                <i class="fas fa-truck"></i>
                <h3>Nenhum fornecedor cadastrado</h3>
                <p>Adicione um novo fornecedor para começar</p>
            </div>
        `;
    } else {
        html += `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Especialidade</th>
                            <th>Email</th>
                            <th>Telefone</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${suppliers.map(s => `
                            <tr>
                                <td><strong>${s.name}</strong></td>
                                <td>${s.specialty}</td>
                                <td>${s.email}</td>
                                <td>${s.phone}</td>
                                <td>
                                    <button class="btn-secondary btn-sm" onclick="editSupplier(${s.id})">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn-danger btn-sm" onclick="deleteSupplier(${s.id})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    html += `
        <!-- Add Supplier Modal -->
        <div id="addSupplierModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Novo Fornecedor</h2>
                    <button class="modal-close" onclick="closeModal('addSupplierModal')">×</button>
                </div>
                <form onsubmit="saveSupplier(event)">
                    <div class="form-group">
                        <label>Nome *</label>
                        <input type="text" id="supplierName" required>
                    </div>
                    <div class="form-group">
                        <label>Especialidade *</label>
                        <input type="text" id="supplierSpecialty" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="supplierEmail">
                    </div>
                    <div class="form-group">
                        <label>Telefone</label>
                        <input type="text" id="supplierPhone">
                    </div>
                    <div class="form-group">
                        <label>Endereço</label>
                        <input type="text" id="supplierAddress">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn-secondary" onclick="closeModal('addSupplierModal')">Cancelar</button>
                        <button type="submit" class="btn-primary">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    return html;
}

function saveSupplier(e) {
    e.preventDefault();
    const supplier = {
        name: document.getElementById('supplierName').value,
        specialty: document.getElementById('supplierSpecialty').value,
        email: document.getElementById('supplierEmail').value,
        phone: document.getElementById('supplierPhone').value,
        address: document.getElementById('supplierAddress').value
    };
    db.addSupplier(supplier);
    UIManager.showNotification('Fornecedor adicionado com sucesso!');
    closeModal('addSupplierModal');
    renderSuppliersPage();
}

function deleteSupplier(id) {
    if (confirm('Tem certeza que deseja remover este fornecedor?')) {
        db.deleteSupplier(id);
        UIManager.showNotification('Fornecedor removido com sucesso!');
        renderSuppliersPage();
    }
}

// Incoming Notes Page
function renderIncomingNotesPage() {
    const notes = db.getIncomingNotes();
    
    let html = `
        <div class="page-header">
            <h1>Notas de Entrada</h1>
            <button class="btn-primary" onclick="openModal('addNoteModal')">
                <i class="fas fa-plus"></i> Nova Nota
            </button>
        </div>
    `;

    if (notes.length === 0) {
        html += `
            <div class="empty-state">
                <i class="fas fa-file-import"></i>
                <h3>Nenhuma nota de entrada</h3>
                <p>Adicione uma nova nota para começar</p>
            </div>
        `;
    } else {
        html += `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Número</th>
                            <th>Fornecedor</th>
                            <th>Quantidade</th>
                            <th>Data</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${notes.slice().reverse().map(n => `
                            <tr>
                                <td><strong>${n.number}</strong></td>
                                <td>${n.supplier}</td>
                                <td>${n.quantity} animais</td>
                                <td>${UIManager.formatDate(n.date)}</td>
                                <td><span style="color: var(--success);">✓ ${n.status}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    html += `
        <!-- Add Note Modal -->
        <div id="addNoteModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Nova Nota de Entrada</h2>
                    <button class="modal-close" onclick="closeModal('addNoteModal')">×</button>
                </div>
                <form onsubmit="saveIncomingNote(event)">
                    <div class="form-group">
                        <label>Número da Nota *</label>
                        <input type="text" id="noteNumber" required>
                    </div>
                    <div class="form-group">
                        <label>Fornecedor *</label>
                        <input type="text" id="noteSupplier" required>
                    </div>
                    <div class="form-group">
                        <label>Quantidade de Animais *</label>
                        <input type="number" id="noteQuantity" required>
                    </div>
                    <div class="form-group">
                        <label>Data *</label>
                        <input type="date" id="noteDate" required>
                    </div>
                    <div class="form-group">
                        <label>Observações</label>
                        <textarea id="noteObservations"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn-secondary" onclick="closeModal('addNoteModal')">Cancelar</button>
                        <button type="submit" class="btn-primary">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    return html;
}

function saveIncomingNote(e) {
    e.preventDefault();
    const note = {
        number: document.getElementById('noteNumber').value,
        supplier: document.getElementById('noteSupplier').value,
        quantity: document.getElementById('noteQuantity').value,
        date: document.getElementById('noteDate').value,
        observations: document.getElementById('noteObservations').value,
        status: 'Recebido'
    };
    db.addIncomingNote(note);
    UIManager.showNotification('Nota de entrada registrada com sucesso!');
    closeModal('addNoteModal');
    renderIncomingNotesPage();
}

// Sales Contracts Page
function renderSalesContractsPage() {
    const contracts = db.getSalesContracts();
    
    let html = `
        <div class="page-header">
            <h1>Contratos de Venda</h1>
            <button class="btn-primary" onclick="openModal('addContractModal')">
                <i class="fas fa-plus"></i> Novo Contrato
            </button>
        </div>
    `;

    if (contracts.length === 0) {
        html += `
            <div class="empty-state">
                <i class="fas fa-file-contract"></i>
                <h3>Nenhum contrato de venda</h3>
                <p>Adicione um novo contrato para começar</p>
            </div>
        `;
    } else {
        html += `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Número</th>
                            <th>Cliente</th>
                            <th>Quantidade</th>
                            <th>Valor Total</th>
                            <th>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${contracts.slice().reverse().map(c => `
                            <tr>
                                <td><strong>${c.number}</strong></td>
                                <td>${c.client}</td>
                                <td>${c.quantity} animais</td>
                                <td>R$ ${parseFloat(c.totalValue).toFixed(2)}</td>
                                <td>${UIManager.formatDate(c.date)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    html += `
        <!-- Add Contract Modal -->
        <div id="addContractModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Novo Contrato de Venda</h2>
                    <button class="modal-close" onclick="closeModal('addContractModal')">×</button>
                </div>
                <form onsubmit="saveSalesContract(event)">
                    <div class="form-group">
                        <label>Número do Contrato *</label>
                        <input type="text" id="contractNumber" required>
                    </div>
                    <div class="form-group">
                        <label>Cliente *</label>
                        <input type="text" id="contractClient" required>
                    </div>
                    <div class="form-group">
                        <label>Quantidade de Animais *</label>
                        <input type="number" id="contractQuantity" required>
                    </div>
                    <div class="form-group">
                        <label>Valor Total *</label>
                        <input type="number" id="contractTotalValue" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label>Data *</label>
                        <input type="date" id="contractDate" required>
                    </div>
                    <div class="form-group">
                        <label>Observações</label>
                        <textarea id="contractObservations"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn-secondary" onclick="closeModal('addContractModal')">Cancelar</button>
                        <button type="submit" class="btn-primary">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    return html;
}

function saveSalesContract(e) {
    e.preventDefault();
    const contract = {
        number: document.getElementById('contractNumber').value,
        client: document.getElementById('contractClient').value,
        quantity: document.getElementById('contractQuantity').value,
        totalValue: document.getElementById('contractTotalValue').value,
        date: document.getElementById('contractDate').value,
        observations: document.getElementById('contractObservations').value
    };
    db.addSalesContract(contract);
    UIManager.showNotification('Contrato de venda registrado com sucesso!');
    closeModal('addContractModal');
    renderSalesContractsPage();
}

// Reports Page
function renderReportsPage() {
    const animals = db.getAnimals();
    const weights = db.getWeights();
    const vaccines = db.getVaccines();
    const events = db.getEvents();
    
    const avgWeight = weights.length > 0 ? (weights.reduce((sum, w) => sum + parseFloat(w.weight || 0), 0) / weights.length).toFixed(2) : 0;
    const vaccineCount = vaccines.length;
    const eventCount = events.length;
    
    let html = `
        <div class="page-header">
            <h1>Relatórios</h1>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <i class="fas fa-cow"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-label">Total de Animais</div>
                    <div class="stat-value">${animals.length}</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                    <i class="fas fa-weight"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-label">Peso Médio</div>
                    <div class="stat-value">${avgWeight} kg</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                    <i class="fas fa-syringe"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-label">Vacinas Aplicadas</div>
                    <div class="stat-value">${vaccineCount}</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
                    <i class="fas fa-calendar-alt"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-label">Eventos Registrados</div>
                    <div class="stat-value">${eventCount}</div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Resumo por Raça</h3>
                <button class="btn-secondary btn-sm" onclick="exportReportCSV()">
                    <i class="fas fa-download"></i> Exportar CSV
                </button>
            </div>
            <div class="card-content">
                <table style="width: 100%; margin-top: 15px;">
                    <thead>
                        <tr style="background: var(--bg-tertiary);">
                            <th style="padding: 10px; text-align: left;">Raça</th>
                            <th style="padding: 10px; text-align: left;">Quantidade</th>
                            <th style="padding: 10px; text-align: left;">Percentual</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(() => {
                            const breeds = {};
                            animals.forEach(a => {
                                breeds[a.breed] = (breeds[a.breed] || 0) + 1;
                            });
                            return Object.entries(breeds).map(([breed, count]) => `
                                <tr style="border-bottom: 1px solid var(--border);">
                                    <td style="padding: 10px;">${breed}</td>
                                    <td style="padding: 10px;">${count}</td>
                                    <td style="padding: 10px;">${((count / animals.length) * 100).toFixed(1)}%</td>
                                </tr>
                            `).join('');
                        })()}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    return html;
}

function exportReportCSV() {
    const animals = db.getAnimals();
    const breeds = {};
    animals.forEach(a => {
        breeds[a.breed] = (breeds[a.breed] || 0) + 1;
    });

    let csv = 'Raça,Quantidade,Percentual\n';
    Object.entries(breeds).forEach(([breed, count]) => {
        csv += `${breed},${count},${((count / animals.length) * 100).toFixed(1)}%\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
}

// Alerts Page
function renderAlertsPage() {
    const alerts = db.getAlerts();
    
    let html = `
        <div class="page-header">
            <h1>Alertas e Notificações</h1>
        </div>
    `;

    if (alerts.length === 0) {
        html += `
            <div class="empty-state">
                <i class="fas fa-bell"></i>
                <h3>Nenhum alerta</h3>
                <p>Você está em dia com todas as atividades</p>
            </div>
        `;
    } else {
        html += `
            <div style="display: flex; flex-direction: column; gap: 15px;">
                ${alerts.slice().reverse().map(a => `
                    <div class="card" style="border-left: 4px solid ${a.type === 'warning' ? 'var(--warning)' : 'var(--info)'};">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                            <div>
                                <h3 style="margin: 0 0 5px 0; color: var(--text-primary);">${a.title}</h3>
                                <p style="margin: 0 0 10px 0; color: var(--text-secondary);">${a.message}</p>
                                <small style="color: var(--text-tertiary);">${UIManager.formatDateTime(a.date)}</small>
                            </div>
                            <button class="btn-secondary btn-sm" onclick="markAlertAsRead(${a.id})">
                                ${a.read ? '✓ Lido' : 'Marcar como lido'}
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    return html;
}

function markAlertAsRead(id) {
    db.markAlertAsRead(id);
    renderAlertsPage();
}

// Insights Page
function renderInsightsPage() {
    const animals = db.getAnimals();
    const weights = db.getWeights();
    
    let html = `
        <div class="page-header">
            <h1>Análise de Dados</h1>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <i class="fas fa-chart-line"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-label">Crescimento Médio</div>
                    <div class="stat-value">+2.5%</div>
                    <div class="stat-change">Este mês</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                    <i class="fas fa-trending-up"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-label">Saúde do Rebanho</div>
                    <div class="stat-value">95%</div>
                    <div class="stat-change">Excelente</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                    <i class="fas fa-heartbeat"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-label">Taxa de Vacinação</div>
                    <div class="stat-value">98%</div>
                    <div class="stat-change">Atualizado</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
                    <i class="fas fa-chart-pie"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-label">Produtividade</div>
                    <div class="stat-value">+18%</div>
                    <div class="stat-change">vs mês anterior</div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Distribuição por Raça</h3>
            </div>
            <div class="card-content">
                <div style="padding: 20px 0;">
                    ${(() => {
                        const breeds = {};
                        animals.forEach(a => {
                            breeds[a.breed] = (breeds[a.breed] || 0) + 1;
                        });
                        return Object.entries(breeds).map(([breed, count]) => `
                            <div style="margin-bottom: 15px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                    <span>${breed}</span>
                                    <strong>${count}</strong>
                                </div>
                                <div style="width: 100%; height: 8px; background: var(--bg-tertiary); border-radius: 4px; overflow: hidden;">
                                    <div style="width: ${(count / animals.length) * 100}%; height: 100%; background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);"></div>
                                </div>
                            </div>
                        `).join('');
                    })()}
                </div>
            </div>
        </div>
    `;

    return html;
}

// Weight Comparison Page
function renderWeightComparisonPage() {
    const weights = db.getWeights();
    
    let html = `
        <div class="page-header">
            <h1>Comparativo de Pesos</h1>
        </div>

        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Evolução de Pesos</h3>
            </div>
            <div class="card-content">
                ${weights.length === 0 ? `
                    <div class="empty-state" style="padding: 40px 20px;">
                        <i class="fas fa-chart-bar"></i>
                        <p>Nenhum registro de peso para comparar</p>
                    </div>
                ` : `
                    <table style="width: 100%; margin-top: 15px;">
                        <thead>
                            <tr style="background: var(--bg-tertiary);">
                                <th style="padding: 10px; text-align: left;">Brinco</th>
                                <th style="padding: 10px; text-align: left;">Peso (kg)</th>
                                <th style="padding: 10px; text-align: left;">Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${weights.slice().reverse().map(w => `
                                <tr style="border-bottom: 1px solid var(--border);">
                                    <td style="padding: 10px;">${w.earTagNumber}</td>
                                    <td style="padding: 10px;"><strong>${w.weight} kg</strong></td>
                                    <td style="padding: 10px;">${UIManager.formatDate(w.date)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `}
            </div>
        </div>
    `;

    return html;
}

// Profit Simulator Page
function renderProfitSimulatorPage() {
    let html = `
        <div class="page-header">
            <h1>Simulador de Lucro</h1>
        </div>

        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Calcular Lucratividade</h3>
            </div>
            <div class="card-content">
                <form onsubmit="calculateProfit(event)">
                    <div class="grid-2">
                        <div class="form-group">
                            <label>Número de Animais *</label>
                            <input type="number" id="profitAnimals" required>
                        </div>
                        <div class="form-group">
                            <label>Peso Médio (kg) *</label>
                            <input type="number" id="profitWeight" step="0.1" required>
                        </div>
                        <div class="form-group">
                            <label>Preço por kg (R$) *</label>
                            <input type="number" id="profitPrice" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label>Custo Total (R$) *</label>
                            <input type="number" id="profitCost" step="0.01" required>
                        </div>
                    </div>
                    <button type="submit" class="btn-primary">Calcular</button>
                </form>
                <div id="profitResult" style="margin-top: 20px;"></div>
            </div>
        </div>
    `;

    return html;
}

function calculateProfit(e) {
    e.preventDefault();
    const animals = parseFloat(document.getElementById('profitAnimals').value);
    const weight = parseFloat(document.getElementById('profitWeight').value);
    const price = parseFloat(document.getElementById('profitPrice').value);
    const cost = parseFloat(document.getElementById('profitCost').value);

    const totalWeight = animals * weight;
    const revenue = totalWeight * price;
    const profit = revenue - cost;
    const margin = ((profit / revenue) * 100).toFixed(2);

    const result = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <i class="fas fa-dollar-sign"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-label">Receita Total</div>
                    <div class="stat-value">R$ ${revenue.toFixed(2)}</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                    <i class="fas fa-money-bill"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-label">Custo Total</div>
                    <div class="stat-value">R$ ${cost.toFixed(2)}</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                    <i class="fas fa-chart-line"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-label">Lucro Líquido</div>
                    <div class="stat-value">R$ ${profit.toFixed(2)}</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
                    <i class="fas fa-percent"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-label">Margem de Lucro</div>
                    <div class="stat-value">${margin}%</div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('profitResult').innerHTML = result;
}

// Search Page
function renderSearchPage() {
    let html = `
        <div class="page-header">
            <h1>Busca Avançada</h1>
        </div>

        <div class="card" style="margin-bottom: 20px;">
            <div class="form-group">
                <label>Buscar por Brinco</label>
                <input type="text" id="searchEarTag" placeholder="Digite o número do brinco" onkeyup="performSearch()">
            </div>
        </div>

        <div id="searchResults"></div>
    `;

    return html;
}

function performSearch() {
    const query = document.getElementById('searchEarTag').value.toLowerCase();
    const animals = db.getAnimals();
    const weights = db.getWeights();
    const vaccines = db.getVaccines();

    const results = {
        animals: animals.filter(a => a.earTagNumber.toLowerCase().includes(query)),
        weights: weights.filter(w => w.earTagNumber.toLowerCase().includes(query)),
        vaccines: vaccines.filter(v => v.earTagNumber.toLowerCase().includes(query))
    };

    let html = '';

    if (query.length === 0) {
        html = '<p style="color: var(--text-secondary);">Digite um número de brinco para buscar</p>';
    } else if (results.animals.length === 0 && results.weights.length === 0 && results.vaccines.length === 0) {
        html = '<div class="empty-state"><i class="fas fa-search"></i><p>Nenhum resultado encontrado</p></div>';
    } else {
        if (results.animals.length > 0) {
            html += `
                <div class="card" style="margin-bottom: 15px;">
                    <div class="card-header">
                        <h3 class="card-title">Animais (${results.animals.length})</h3>
                    </div>
                    <div class="card-content">
                        <table style="width: 100%; margin-top: 10px;">
                            <thead>
                                <tr style="background: var(--bg-tertiary);">
                                    <th style="padding: 10px; text-align: left;">Brinco</th>
                                    <th style="padding: 10px; text-align: left;">Raça</th>
                                    <th style="padding: 10px; text-align: left;">Lote</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${results.animals.map(a => `
                                    <tr style="border-bottom: 1px solid var(--border);">
                                        <td style="padding: 10px;"><strong>${a.earTagNumber}</strong></td>
                                        <td style="padding: 10px;">${a.breed}</td>
                                        <td style="padding: 10px;">${a.batch}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        if (results.weights.length > 0) {
            html += `
                <div class="card" style="margin-bottom: 15px;">
                    <div class="card-header">
                        <h3 class="card-title">Pesos (${results.weights.length})</h3>
                    </div>
                    <div class="card-content">
                        <table style="width: 100%; margin-top: 10px;">
                            <thead>
                                <tr style="background: var(--bg-tertiary);">
                                    <th style="padding: 10px; text-align: left;">Brinco</th>
                                    <th style="padding: 10px; text-align: left;">Peso</th>
                                    <th style="padding: 10px; text-align: left;">Data</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${results.weights.map(w => `
                                    <tr style="border-bottom: 1px solid var(--border);">
                                        <td style="padding: 10px;"><strong>${w.earTagNumber}</strong></td>
                                        <td style="padding: 10px;">${w.weight} kg</td>
                                        <td style="padding: 10px;">${UIManager.formatDate(w.date)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        if (results.vaccines.length > 0) {
            html += `
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Vacinas (${results.vaccines.length})</h3>
                    </div>
                    <div class="card-content">
                        <table style="width: 100%; margin-top: 10px;">
                            <thead>
                                <tr style="background: var(--bg-tertiary);">
                                    <th style="padding: 10px; text-align: left;">Brinco</th>
                                    <th style="padding: 10px; text-align: left;">Tipo</th>
                                    <th style="padding: 10px; text-align: left;">Data</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${results.vaccines.map(v => `
                                    <tr style="border-bottom: 1px solid var(--border);">
                                        <td style="padding: 10px;"><strong>${v.earTagNumber}</strong></td>
                                        <td style="padding: 10px;">${v.vaccineType}</td>
                                        <td style="padding: 10px;">${UIManager.formatDate(v.date)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }
    }

    document.getElementById('searchResults').innerHTML = html;
}

// Settings Page
function renderSettingsPage() {
    let html = `
        <div class="page-header">
            <h1>Configurações</h1>
        </div>

        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Preferências do Sistema</h3>
            </div>
            <div class="card-content">
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="notificationsEnabled" checked>
                        Ativar Notificações
                    </label>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="darkModeEnabled">
                        Modo Escuro
                    </label>
                </div>
                <button class="btn-primary" onclick="saveSettings()">Salvar Configurações</button>
            </div>
        </div>

        <div class="card" style="margin-top: 20px;">
            <div class="card-header">
                <h3 class="card-title">Dados</h3>
            </div>
            <div class="card-content">
                <p style="margin-bottom: 15px;">Exporte ou limpe seus dados:</p>
                <button class="btn-secondary" onclick="exportAllData()">
                    <i class="fas fa-download"></i> Exportar Dados
                </button>
                <button class="btn-danger" onclick="clearAllData()" style="margin-left: 10px;">
                    <i class="fas fa-trash"></i> Limpar Tudo
                </button>
            </div>
        </div>
    `;

    return html;
}

function saveSettings() {
    UIManager.showNotification('Configurações salvas com sucesso!');
}

function exportAllData() {
    const data = db.getDB();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `farm-pro-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
}

function clearAllData() {
    if (confirm('Tem certeza? Todos os dados serão perdidos!')) {
        localStorage.removeItem('farmDB');
        db.init();
        UIManager.showNotification('Todos os dados foram removidos!');
        navigateTo('dashboard');
    }
}

// Profile Page
function renderProfilePage() {
    let html = `
        <div class="page-header">
            <h1>Meu Perfil</h1>
        </div>

        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Informações Pessoais</h3>
            </div>
            <div class="card-content">
                <div class="form-group">
                    <label>Nome</label>
                    <input type="text" id="profileName" value="João Silva">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="profileEmail" value="joao@example.com">
                </div>
                <div class="form-group">
                    <label>Telefone</label>
                    <input type="text" id="profilePhone" value="">
                </div>
                <button class="btn-primary" onclick="saveProfile()">Salvar Perfil</button>
            </div>
        </div>

        <div class="card" style="margin-top: 20px;">
            <div class="card-header">
                <h3 class="card-title">Alterar Senha</h3>
            </div>
            <div class="card-content">
                <div class="form-group">
                    <label>Senha Atual</label>
                    <input type="password" id="currentPassword">
                </div>
                <div class="form-group">
                    <label>Nova Senha</label>
                    <input type="password" id="newPassword">
                </div>
                <div class="form-group">
                    <label>Confirmar Senha</label>
                    <input type="password" id="confirmPassword">
                </div>
                <button class="btn-primary" onclick="changePassword()">Alterar Senha</button>
            </div>
        </div>
    `;

    return html;
}

function saveProfile() {
    UIManager.showNotification('Perfil atualizado com sucesso!');
}

function changePassword() {
    const newPass = document.getElementById('newPassword').value;
    const confirmPass = document.getElementById('confirmPassword').value;

    if (newPass !== confirmPass) {
        UIManager.showNotification('As senhas não coincidem!', 'error');
        return;
    }

    if (newPass.length < 6) {
        UIManager.showNotification('A senha deve ter no mínimo 6 caracteres!', 'error');
        return;
    }

    UIManager.showNotification('Senha alterada com sucesso!');
}

// NFe Operations Page
function renderNfeOperationsPage() {
    let html = `
        <div class="page-header">
            <h1>Operações NF-e</h1>
        </div>

        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Gerenciar Operações</h3>
            </div>
            <div class="card-content">
                <p style="margin-bottom: 15px;">Configure os tipos de operação para suas NF-e:</p>
                <ul style="list-style: none; padding: 0;">
                    <li style="padding: 10px 0; border-bottom: 1px solid var(--border);">
                        <strong>Venda de Animais</strong> - Operação de venda
                    </li>
                    <li style="padding: 10px 0; border-bottom: 1px solid var(--border);">
                        <strong>Entrada de Animais</strong> - Recebimento de animais
                    </li>
                    <li style="padding: 10px 0;">
                        <strong>Transferência</strong> - Transferência entre lotes
                    </li>
                </ul>
            </div>
        </div>
    `;

    return html;
}
