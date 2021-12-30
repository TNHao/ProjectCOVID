

const btnRegister = document.querySelector('#btn-register')
const inputRelate = document.querySelector('#registerRelate')

const addToInputRelate = (id) => {
    const ids = inputRelate.value.split(',')
    if(!ids.includes(id)) {
        ids.push(id)
        const newInputValue = ids.filter(currentId => currentId !== '').join(',')
        inputRelate.value = newInputValue
    }
}

const removeFromInputRelate = (id) => {
    const ids = inputRelate.value.split(',')
    console.log(ids)
    const newInputValue = ids.filter(currentId => currentId !== id)
    inputRelate.value = newInputValue
}

const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'))
const ids = inputRelate.value.split(',')
    checkboxes.forEach(checkbox => {
        if(ids.includes(checkbox.id)) checkbox.checked = true
        checkbox.addEventListener('click', e => {
            if(e.target.checked) {
                addToInputRelate(e.target.id)
            } else {
                removeFromInputRelate(e.target.id)
            }
        })
    })