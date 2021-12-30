const handleIsolationWardModal = (data) => {
    if (!data) {
        document.getElementById('name').value = "";
        document.getElementById('capacity').value = "";
        document.getElementById('used').value = "";
        return;
    }

    const { name, capacity, used } = data;

    document.getElementById('name').value = name;
    document.getElementById('capacity').value = capacity;
    document.getElementById('used').value = used;
}


const handleCategoryModal = (data, formId = '') => {
    const form = document.querySelector(`#${formId}`);

    // add or create modal
    if(formId === 'form-submit') {
        if (!data) {
            document.getElementById('name').value = "";
            return;
        }
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
