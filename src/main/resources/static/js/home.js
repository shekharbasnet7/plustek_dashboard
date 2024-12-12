// Initialize Data in Local Storage if Not Present
if (!localStorage.getItem('categories')) {
    localStorage.setItem('categories', JSON.stringify(['Uncategorized']));
}

if (!localStorage.getItem('links')) {
    localStorage.setItem('links', JSON.stringify([]));
}

// DOM Elements
const categoriesListSidebar = document.getElementById('categoriesListSidebar');
const linksContainer = document.getElementById('linksContainer');
const modal = document.getElementById('modal');
const categoryModal = document.getElementById('categoryModal');
const openModalBtn = document.getElementById('openModal');
const closeModalBtn = document.getElementById('closeModal');
const openCategoryModalBtn = document.getElementById('openCategoryModal');
const closeCategoryModalBtn = document.getElementById('closeCategoryModal');
const saveLinkButton = document.getElementById('saveLinkButton');
const addCategoryButton = document.getElementById('addCategoryButton');

// Form Fields for Links
const titleInput = document.getElementById('title');
const urlInput = document.getElementById('url');
const descriptionInput = document.getElementById('description');
const categorySelect = document.getElementById('category');
const fileTypeSelect = document.getElementById('fileType');

// Form Fields for Categories
const newCategoryInput = document.getElementById('newCategory');

// Current Editing IDs
let currentEditLinkId = null;
let currentEditCategory = null;

// Currently Selected Category
let selectedCategory = 'All Links';

// Fetch and Display Categories in Sidebar
function fetchCategoriesSidebar() {
    const categories = JSON.parse(localStorage.getItem('categories'));
    categoriesListSidebar.innerHTML = '';

    // Add "All Links" as the first category
    const allLinksItem = document.createElement('li');
    allLinksItem.className = 'category-item';
    allLinksItem.textContent = 'All Links';
    allLinksItem.dataset.category = 'All Links';
    if (selectedCategory === 'All Links') {
        allLinksItem.classList.add('active');
    }
    allLinksItem.addEventListener('click', () => selectCategory('All Links'));
    categoriesListSidebar.appendChild(allLinksItem);

    categories.forEach(category => {
        const categoryItem = document.createElement('li');
        categoryItem.className = 'category-item';
        categoryItem.textContent = category;
        categoryItem.dataset.category = category;
        if (selectedCategory === category) {
            categoryItem.classList.add('active');
        }

        categoryItem.addEventListener('click', () => selectCategory(category));

        categoriesListSidebar.appendChild(categoryItem);
    });
}

// Fetch and Display Categories in Select Dropdown and Sidebar Modal
function fetchCategoriesSelect() {
    const categories = JSON.parse(localStorage.getItem('categories'));
    categorySelect.innerHTML = '<option value="" disabled selected>Select Category</option>';

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

// Fetch and Display Categories in Sidebar Modal
function fetchCategoriesModal() {
    const categories = JSON.parse(localStorage.getItem('categories'));
    const categoriesList = document.getElementById('categoriesList');
    categoriesList.innerHTML = '';

    categories.forEach(category => {
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';
        categoryItem.textContent = category;

        if (category !== 'Uncategorized') {
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'delete-category-btn';
            deleteBtn.onclick = () => deleteCategory(category);
            categoryItem.appendChild(deleteBtn);
        }

        categoriesList.appendChild(categoryItem);
    });
}

// Select a Category and Fetch Links
function selectCategory(category) {
    selectedCategory = category;
    highlightSelectedCategory();
    fetchLinks();
}

// Highlight the Selected Category in Sidebar
function highlightSelectedCategory() {
    const categoryItems = categoriesListSidebar.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        if (item.dataset.category === selectedCategory) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Fetch and Display Links Based on Selected Category
function fetchLinks() {
    const links = JSON.parse(localStorage.getItem('links'));
    linksContainer.innerHTML = '';

    let filteredLinks = [];

    if (selectedCategory === 'All Links') {
        filteredLinks = links;
    } else {
        filteredLinks = links.filter(link => link.category === selectedCategory);
    }

    if (filteredLinks.length === 0) {
        linksContainer.innerHTML = '<p>No links available in this category. Click the + button to add one.</p>';
        return;
    }

    filteredLinks.forEach(link => {
        const card = document.createElement('div');
        card.className = 'card';

        card.innerHTML = `
            <h3>${link.title}</h3>
            <p>${link.description}</p>
            <p class="timestamp">Added on ${new Date(link.timestamp).toLocaleString()}</p>
            <div class="card-buttons">
                <button class="edit" onclick="editLink(${link.id})">                
                <img src="/icons/edit-card.png" alt="Edit Icon">
                </button>
                
    

                <button class="delete" onclick="deleteLink(${link.id})">Delete</button>
            </div>
        `;

        // Open link in new tab when clicking on the card except on buttons
        card.addEventListener('click', (e) => {
            if (e.target.tagName.toLowerCase() !== 'button') {
                window.open(link.url, '_blank');
            }
        });

        linksContainer.appendChild(card);
    });

    // Update Current Category Title
    const currentCategoryTitle = document.getElementById('currentCategoryTitle');
    currentCategoryTitle.textContent = selectedCategory;
}

// Save Link (Add or Edit)
function saveLink() {
    const title = titleInput.value.trim();
    const url = urlInput.value.trim();
    const description = descriptionInput.value.trim();
    const category = categorySelect.value;
    const fileType = fileTypeSelect.value;

    if (!title || !url || !description || !category || !fileType) {
        alert('Please fill in all fields.');
        return;
    }

    const links = JSON.parse(localStorage.getItem('links'));

    if (currentEditLinkId !== null) {
        // Edit Existing Link
        const linkIndex = links.findIndex(link => link.id === currentEditLinkId);
        if (linkIndex !== -1) {
            links[linkIndex] = {
                id: currentEditLinkId,
                title,
                url,
                description,
                category,
                fileType,
                timestamp: links[linkIndex].timestamp
            };
            localStorage.setItem('links', JSON.stringify(links));
            fetchLinks();
            closeModal();
            currentEditLinkId = null;
        }
    } else {
        // Add New Link
        const newLink = {
            id: Date.now(),
            title,
            url,
            description,
            category,
            fileType,
            timestamp: new Date().toISOString()
        };
        links.push(newLink);
        localStorage.setItem('links', JSON.stringify(links));
        fetchLinks();
        closeModal();
    }

    // Clear Form
    clearLinkForm();
}

// Edit Link
function editLink(id) {
    const links = JSON.parse(localStorage.getItem('links'));
    const link = links.find(l => l.id === id);
    if (link) {
        currentEditLinkId = id;
        openModal();
        document.getElementById('modalTitle').textContent = 'Edit Link';
        titleInput.value = link.title;
        urlInput.value = link.url;
        descriptionInput.value = link.description;
        categorySelect.value = link.category;
        fileTypeSelect.value = link.fileType;
    }
}

// Delete Link
function deleteLink(id) {
    if (confirm('Are you sure you want to delete this link?')) {
        let links = JSON.parse(localStorage.getItem('links'));
        links = links.filter(link => link.id !== id);
        localStorage.setItem('links', JSON.stringify(links));
        fetchLinks();
    }
}

// Clear Link Form
function clearLinkForm() {
    titleInput.value = '';
    urlInput.value = '';
    descriptionInput.value = '';
    categorySelect.value = '';
    fileTypeSelect.value = '';
}

// Open Link Modal
function openModal() {
    modal.style.display = 'block';
    document.getElementById('modalTitle').textContent = 'Add Link';
    clearLinkForm();
    currentEditLinkId = null;
}

// Close Link Modal
function closeModal() {
    modal.style.display = 'none';
    clearLinkForm();
    currentEditLinkId = null;
}

// Open Category Modal
function openCategoryModal() {
    categoryModal.style.display = 'block';
    fetchCategoriesModal();
}

// Close Category Modal
function closeCategoryModal() {
    categoryModal.style.display = 'none';
}

// Add Category
function addCategory() {
    const newCategory = newCategoryInput.value.trim();
    if (!newCategory) {
        alert('Please enter a category name.');
        return;
    }

    const categories = JSON.parse(localStorage.getItem('categories'));

    if (categories.includes(newCategory)) {
        alert('Category already exists.');
        return;
    }

    categories.push(newCategory);
    localStorage.setItem('categories', JSON.stringify(categories));
    fetchCategoriesSidebar();
    fetchCategoriesSelect();
    fetchCategoriesModal();
    newCategoryInput.value = '';
}

// Delete Category
function deleteCategory(category) {
    if (category === 'Uncategorized') {
        alert('Cannot delete the "Uncategorized" category.');
        return;
    }

    if (confirm(`Are you sure you want to delete the category "${category}"?`)) {
        let categories = JSON.parse(localStorage.getItem('categories'));
        categories = categories.filter(cat => cat !== category);
        localStorage.setItem('categories', JSON.stringify(categories));

        // Update links with the deleted category to 'Uncategorized'
        let links = JSON.parse(localStorage.getItem('links'));
        links.forEach(link => {
            if (link.category === category) {
                link.category = 'Uncategorized';
            }
        });
        localStorage.setItem('links', JSON.stringify(links));

        // If the deleted category was selected, switch to 'All Links'
        if (selectedCategory === category) {
            selectedCategory = 'All Links';
        }

        fetchCategoriesSidebar();
        fetchCategoriesSelect();
        fetchCategoriesModal();
        fetchLinks();
    }
}

// Event Listeners
openModalBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
openCategoryModalBtn.addEventListener('click', openCategoryModal);
closeCategoryModalBtn.addEventListener('click', closeCategoryModal);
saveLinkButton.addEventListener('click', saveLink);
addCategoryButton.addEventListener('click', addCategory);

// Close Modals When Clicking Outside
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
    if (event.target === categoryModal) {
        closeCategoryModal();
    }
});

// Initial Fetch
fetchCategoriesSidebar();
fetchCategoriesSelect();
fetchCategoriesModal();
fetchLinks();

// Expose editLink and deleteLink to global scope for inline onclick handlers
window.editLink = editLink;
window.deleteLink = deleteLink;
