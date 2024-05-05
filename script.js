document.getElementById('sortOptions').addEventListener('change', function() {
    sortProducts(this.value);
});

document.getElementById('itemsPerPage').addEventListener('change', function() {
    itemsPerPage = parseInt(this.value);
    currentPage = 1;
    renderCatalog();
});

let currentPage = 1;
let itemsPerPage = 10; // valor inicial
let totalItems = 0; // Variable global para mantener el conteo total de items

function renderCatalog() {
    const plants = Array.from(document.querySelectorAll('.plant'));
    totalItems = plants.length; // Actualiza el conteo total
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const visibleItems = plants.slice(start, end);

    document.querySelector('.catalog').innerHTML = '';
    visibleItems.forEach(plant => document.querySelector('.catalog').appendChild(plant));
    updatePagination();
}

function sortProducts(method) {
    let plants = Array.from(document.querySelectorAll('.plant'));
    plants.sort((a, b) => {
        let aValue = a.querySelector('.plant-bid').textContent.replace('Valor: $', '');
        let bValue = b.querySelector('.plant-bid').textContent.replace('Valor: $', '');
        let aName = a.querySelector('.plant-name').textContent.trim();
        let bName = b.querySelector('.plant-name').textContent.trim();

        switch (method) {
            case 'priceAsc':
                return parseFloat(aValue) - parseFloat(bValue);
            case 'priceDesc':
                return parseFloat(bValue) - parseFloat(aValue);
            case 'nameAsc':
                return aName.localeCompare(bName);
            case 'nameDesc':
                return bName.localeCompare(aName);
        }
    });

    // Reemplaza todos los elementos en .catalog con el nuevo orden
    document.querySelector('.catalog').innerHTML = '';
    plants.forEach(plant => document.querySelector('.catalog').appendChild(plant));
    renderCatalog(); // Re-renderiza para aplicar paginación sobre los elementos ordenados
}

function updatePagination() {
    let totalPages = Math.ceil(totalItems / itemsPerPage);
    document.getElementById('pageInfo').textContent = `Página ${currentPage} de ${totalPages}`;
}

function changePage(direction) {
    let totalPages = Math.ceil(totalItems / itemsPerPage);
    currentPage += direction;
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    renderCatalog();
}

function filterPlants() {
    let searchInput = document.getElementById('searchBox').value;
    searchInput = normalizeText(searchInput);
    const plants = document.querySelectorAll('.plant');

    plants.forEach(plant => {
        let name = plant.querySelector('.plant-name').textContent;
        let description = plant.querySelector('.plant-description').textContent;
        name = normalizeText(name);
        description = normalizeText(description);

        if (name.includes(searchInput) || description.includes(searchInput)) {
            plant.style.display = "";
        } else {
            plant.style.display = "none";
        }
    });
}

function normalizeText(text) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

window.onload = () => {
    sortProducts('nameAsc'); // Orden alfabético por defecto
    renderCatalog();
};
