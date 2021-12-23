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