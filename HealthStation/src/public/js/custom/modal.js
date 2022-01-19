const handleIsolationWardModal = (data, formId = "") => {
    const form = document.querySelector(`#${formId}`);

    if(formId === 'form-submit') {
        // create new location
        if (!data) {
            document.getElementById('name').value = "";
            document.getElementById('capacity').value = "";
            document.getElementById('num_patients').value = "0";
            return;
        }
    
        // update location
        form.action = form.action + '?_method=PUT';
        const { name, capacity, num_patients, location_id } = data;
        document.getElementById('name').value = name;
        document.getElementById('capacity').value = capacity;
        document.getElementById('capacity').min = num_patients > 10 ? num_patients : 10;
        document.getElementById('num_patients').value = num_patients;
        document.getElementById('location_id').value = location_id;
    } else {
        // delete location
        const location_id = data.getAttribute('data-id')
        document.getElementById('delete_location_id').value = location_id;
    }
}


const handleCategoryModal = (data, formId = '') => {
    const form = document.querySelector(`#${formId}`);

    // create new category
    if(formId === 'form-submit') {
        if (!data) {
            document.getElementById('name').value = "";
            return;
        }

        // update category
        form.action = form.action + '?_method=PUT';
        const { name, category_id } = data;
        document.getElementById('name').value = name;
        document.getElementById('category_id').value = category_id;

    } else {
        // delete modal
        const category_id = data.getAttribute('data-id')
        document.getElementById('delete_category_id').value = category_id;
    }
}

const handleProductModal = (data, formId = '') => {
    // delete modal
    const product_id = data.getAttribute('data-id')
    document.getElementById('delete_product_id').value = product_id;
}

const handlePackageModal = (data, formId = '') => {
    // delete modal
    const package_id = data.getAttribute('data-id')
    document.getElementById('delete_package_id').value = package_id;
}