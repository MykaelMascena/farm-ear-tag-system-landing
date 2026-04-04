// ============================================
// FARM PRO - Sistema de Controle de Rebanho
// Versão HTML Pura com localStorage
// ============================================

// Database Manager (localStorage)
class Database {
    constructor() {
        this.init();
    }

    init() {
        if (!localStorage.getItem('farmDB')) {
            localStorage.setItem('farmDB', JSON.stringify({
                animals: [],
                weights: [],
                vaccines: [],
                events: [],
                producers: [],
                clients: [],
                suppliers: [],
                incomingNotes: [],
                salesContracts: [],
                nfeOperations: [],
                alerts: [],
                breeds: ['Nelore', 'Angus', 'Brahman', 'Guzerá', 'Tabapuã'],
                batches: ['Lote A', 'Lote B', 'Lote C', 'Lote D'],
                vaccineTypes: ['Aftosa', 'Raiva', 'Brucelose', 'Tuberculose', 'IBR', 'BVD'],
                eventTypes: ['Parto', 'Desmame', 'Castração', 'Vacinação', 'Tratamento', 'Outro']
            }));
        }
    }

    getDB() {
        return JSON.parse(localStorage.getItem('farmDB') || '{}');
    }

    saveDB(data) {
        localStorage.setItem('farmDB', JSON.stringify(data));
    }

    // Animals
    getAnimals() {
        return this.getDB().animals || [];
    }

    addAnimal(animal) {
        const db = this.getDB();
        animal.id = Date.now();
        animal.createdAt = new Date().toISOString();
        db.animals.push(animal);
        this.saveDB(db);
        return animal;
    }

    updateAnimal(id, updates) {
        const db = this.getDB();
        const index = db.animals.findIndex(a => a.id === id);
        if (index !== -1) {
            db.animals[index] = { ...db.animals[index], ...updates };
            this.saveDB(db);
            return db.animals[index];
        }
    }

    deleteAnimal(id) {
        const db = this.getDB();
        db.animals = db.animals.filter(a => a.id !== id);
        this.saveDB(db);
    }

    getAnimalsByBreed(breed) {
        return this.getAnimals().filter(a => a.breed === breed);
    }

    // Weights
    getWeights() {
        return this.getDB().weights || [];
    }

    addWeight(weight) {
        const db = this.getDB();
        weight.id = Date.now();
        weight.date = new Date().toISOString();
        db.weights.push(weight);
        this.saveDB(db);
        return weight;
    }

    // Vaccines
    getVaccines() {
        return this.getDB().vaccines || [];
    }

    addVaccine(vaccine) {
        const db = this.getDB();
        vaccine.id = Date.now();
        vaccine.date = new Date().toISOString();
        db.vaccines.push(vaccine);
        this.saveDB(db);
        return vaccine;
    }

    // Events
    getEvents() {
        return this.getDB().events || [];
    }

    addEvent(event) {
        const db = this.getDB();
        event.id = Date.now();
        event.date = new Date().toISOString();
        db.events.push(event);
        this.saveDB(db);
        return event;
    }

    // Producers
    getProducers() {
        return this.getDB().producers || [];
    }

    addProducer(producer) {
        const db = this.getDB();
        producer.id = Date.now();
        db.producers.push(producer);
        this.saveDB(db);
        return producer;
    }

    updateProducer(id, updates) {
        const db = this.getDB();
        const index = db.producers.findIndex(p => p.id === id);
        if (index !== -1) {
            db.producers[index] = { ...db.producers[index], ...updates };
            this.saveDB(db);
            return db.producers[index];
        }
    }

    deleteProducer(id) {
        const db = this.getDB();
        db.producers = db.producers.filter(p => p.id !== id);
        this.saveDB(db);
    }

    // Clients
    getClients() {
        return this.getDB().clients || [];
    }

    addClient(client) {
        const db = this.getDB();
        client.id = Date.now();
        db.clients.push(client);
        this.saveDB(db);
        return client;
    }

    updateClient(id, updates) {
        const db = this.getDB();
        const index = db.clients.findIndex(c => c.id === id);
        if (index !== -1) {
            db.clients[index] = { ...db.clients[index], ...updates };
            this.saveDB(db);
            return db.clients[index];
        }
    }

    deleteClient(id) {
        const db = this.getDB();
        db.clients = db.clients.filter(c => c.id !== id);
        this.saveDB(db);
    }

    // Suppliers
    getSuppliers() {
        return this.getDB().suppliers || [];
    }

    addSupplier(supplier) {
        const db = this.getDB();
        supplier.id = Date.now();
        db.suppliers.push(supplier);
        this.saveDB(db);
        return supplier;
    }

    updateSupplier(id, updates) {
        const db = this.getDB();
        const index = db.suppliers.findIndex(s => s.id === id);
        if (index !== -1) {
            db.suppliers[index] = { ...db.suppliers[index], ...updates };
            this.saveDB(db);
            return db.suppliers[index];
        }
    }

    deleteSupplier(id) {
        const db = this.getDB();
        db.suppliers = db.suppliers.filter(s => s.id !== id);
        this.saveDB(db);
    }

    // Incoming Notes
    getIncomingNotes() {
        return this.getDB().incomingNotes || [];
    }

    addIncomingNote(note) {
        const db = this.getDB();
        note.id = Date.now();
        note.date = new Date().toISOString();
        db.incomingNotes.push(note);
        this.saveDB(db);
        return note;
    }

    // Sales Contracts
    getSalesContracts() {
        return this.getDB().salesContracts || [];
    }

    addSalesContract(contract) {
        const db = this.getDB();
        contract.id = Date.now();
        contract.date = new Date().toISOString();
        db.salesContracts.push(contract);
        this.saveDB(db);
        return contract;
    }

    // Alerts
    getAlerts() {
        return this.getDB().alerts || [];
    }

    addAlert(alert) {
        const db = this.getDB();
        alert.id = Date.now();
        alert.date = new Date().toISOString();
        alert.read = false;
        db.alerts.push(alert);
        this.saveDB(db);
        return alert;
    }

    markAlertAsRead(id) {
        const db = this.getDB();
        const alert = db.alerts.find(a => a.id === id);
        if (alert) {
            alert.read = true;
            this.saveDB(db);
        }
    }

    getUnreadAlerts() {
        return this.getAlerts().filter(a => !a.read).length;
    }

    // Utilities
    getBreeds() {
        return this.getDB().breeds || [];
    }

    getBatches() {
        return this.getDB().batches || [];
    }

    getVaccineTypes() {
        return this.getDB().vaccineTypes || [];
    }

    getEventTypes() {
        return this.getDB().eventTypes || [];
    }
}

// Initialize Database
const db = new Database();

// UI Manager
class UIManager {
    static showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    static formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    static formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('pt-BR');
    }

    static getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
}

// Export for use in HTML
window.db = db;
window.UIManager = UIManager;
