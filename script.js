
let phrases = [

    

    { text: "Police ! Mettez-vous au sol immédiatement !", category: "police" },
    { text: "Vos papiers s'il vous plaît.", category: "police" },
    { text: "Vous êtes en état d'arrestation.", category: "police" },
    { text: "Restez calme et coopérez.", category: "police" },
    { text: "Contrôle de routine, sortez du véhicule.", category: "police" },
    { text: "Vous avez le droit de garder le silence.", category: "police" },
    
    

    { text: "À l'aide ! Quelqu'un peut m'aider ?", category: "urgence" },
    { text: "Appelez une ambulance !", category: "urgence" },
    { text: "Il y a eu un accident !", category: "urgence" },
    { text: "Je suis blessé, j'ai besoin d'aide !", category: "urgence" },
    { text: "Urgence médicale !", category: "urgence" },
    
   
    { text: "*/me regarde autour de lui*", category: "roleplay" },
    { text: "*/me soupire profondément*", category: "roleplay" },
    { text: "*/me sort son téléphone*", category: "roleplay" },
    { text: "*/me allume une cigarette*", category: "roleplay" },
    { text: "*/me vérifie sa montre*", category: "roleplay" },
    { text: "*/me hausse les épaules*", category: "roleplay" },
    { text: "*/me sourit*", category: "roleplay" },
    { text: "*/me fronce les sourcils*", category: "roleplay" }
];


let currentCategory = 'all';
let searchTerm = '';


const phrasesGrid = document.getElementById('phrasesGrid');
const searchInput = document.getElementById('searchInput');
const categoryButtons = document.querySelectorAll('.category-btn');
const addPhraseBtn = document.getElementById('addPhraseBtn');
const newPhraseInput = document.getElementById('newPhrase');
const newCategorySelect = document.getElementById('newCategory');
const notification = document.getElementById('notification');


document.addEventListener('DOMContentLoaded', function() {
    loadPhrases();
    renderPhrases();
    setupEventListeners();
});

function loadPhrases() {
    const savedPhrases = localStorage.getItem('gtaRpPhrases');
    if (savedPhrases) {
        phrases = JSON.parse(savedPhrases);
    }
}


function savePhrases() {
    localStorage.setItem('gtaRpPhrases', JSON.stringify(phrases));
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // Recherche
    searchInput.addEventListener('input', function() {
        searchTerm = this.value.toLowerCase();
        renderPhrases();
    });

    // Boutons de catégorie
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            categoryButtons.forEach(b => b.classList.remove('active'));
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            
            currentCategory = this.dataset.category;
            renderPhrases();
        });
    });

    // Ajouter une nouvelle phrase
    addPhraseBtn.addEventListener('click', addNewPhrase);
    
    // Ajouter phrase avec Entrée
    newPhraseInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addNewPhrase();
        }
    });
}

// Filtrer les phrases
function filterPhrases() {
    return phrases.filter(phrase => {
        const matchesCategory = currentCategory === 'all' || phrase.category === currentCategory;
        const matchesSearch = phrase.text.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });
}

// Rendre les phrases
function renderPhrases() {
    const filteredPhrases = filterPhrases();
    
    phrasesGrid.innerHTML = '';
    
    if (filteredPhrases.length === 0) {
        phrasesGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666; font-size: 1.2rem;">Aucune phrase trouvée 😔</div>';
        return;
    }
    
    filteredPhrases.forEach((phrase, index) => {
        const phraseCard = createPhraseCard(phrase, index);
        phrasesGrid.appendChild(phraseCard);
    });
}

// Créer une carte de phrase
function createPhraseCard(phrase, index) {
    const card = document.createElement('div');
    card.className = 'phrase-card';
    
    card.innerHTML = `
        <div class="phrase-text">${phrase.text}</div>
        <span class="phrase-category">${getCategoryDisplayName(phrase.category)}</span>
        <button class="delete-btn" onclick="deletePhrase(${phrases.indexOf(phrase)})" title="Supprimer">×</button>
    `;
    
    // Ajouter l'événement de clic pour copier
    card.addEventListener('click', function(e) {
        if (!e.target.classList.contains('delete-btn')) {
            copyToClipboard(phrase.text);
        }
    });
    
    return card;
}

// Obtenir le nom d'affichage de la catégorie
function getCategoryDisplayName(category) {
    const displayNames = {
        'salutations': 'Salutations',
        'police': 'Police',
        'civil': 'Civil',
        'urgence': 'Urgence',
        'roleplay': 'Roleplay'
    };
    return displayNames[category] || category;
}

// Copier dans le presse-papier
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Phrase copiée ! 📋');
    } catch (err) {
        // Fallback pour les navigateurs plus anciens
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Phrase copiée ! 📋');
    }
}

// Afficher une notification
function showNotification(message) {
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// Ajouter une nouvelle phrase
function addNewPhrase() {
    const text = newPhraseInput.value.trim();
    const category = newCategorySelect.value;
    
    if (!text) {
        showNotification('⚠️ Veuillez saisir une phrase');
        return;
    }
    
    // Vérifier si la phrase existe déjà
    if (phrases.some(phrase => phrase.text.toLowerCase() === text.toLowerCase())) {
        showNotification('⚠️ Cette phrase existe déjà');
        return;
    }
    
    // Ajouter la nouvelle phrase
    phrases.push({
        text: text,
        category: category
    });
    
    // Sauvegarder et recharger
    savePhrases();
    renderPhrases();
    
    // Vider le champ
    newPhraseInput.value = '';
    
    showNotification('✅ Phrase ajoutée avec succès !');
}

// Supprimer une phrase
function deletePhrase(index) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette phrase ?')) {
        phrases.splice(index, 1);
        savePhrases();
        renderPhrases();
        showNotification('🗑️ Phrase supprimée');
    }
}

// Réinitialiser toutes les phrases (fonction utilitaire)
function resetPhrases() {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les phrases ? Cette action est irréversible.')) {
        localStorage.removeItem('gtaRpPhrases');
        location.reload();
    }
}

// Export/Import des phrases (fonctions bonus)
function exportPhrases() {
    const dataStr = JSON.stringify(phrases, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'gta_rp_phrases.json';
    link.click();
}

function importPhrases(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedPhrases = JSON.parse(e.target.result);
            if (Array.isArray(importedPhrases)) {
                phrases = importedPhrases;
                savePhrases();
                renderPhrases();
                showNotification('✅ Phrases importées avec succès !');
            }
        } catch (error) {
            showNotification('❌ Erreur lors de l\'importation');
        }
    };
    reader.readAsText(file);
}