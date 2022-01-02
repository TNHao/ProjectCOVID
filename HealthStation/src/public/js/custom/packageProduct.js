

const btnRegister = document.querySelector('#btn-register')
const inputProducts = document.querySelector('#registerProducts')

const addToInputRelate = (checkbox) => {

    const maxNumberPerPackage = checkbox.nextSibling.nextSibling.value;
    let products = inputProducts.value.split(',')
    products = products.filter(product => product !== '')

    for(const i in products) {
        products[i] = products[i].split('-')
    }

    // product has been added
    for(const product of products) {
        if(product[0] === checkbox.id)
        return;
    }

    if(maxNumberPerPackage !== '') {
        const newProduct = [checkbox.id, maxNumberPerPackage]
        products.push(newProduct)

        let newInputValue = ''
        for(const product of products) {
            const standardProduct = product.join('-')
            newInputValue += standardProduct
            newInputValue += ','
        }
        inputProducts.value = newInputValue
    } else {
        checkbox.checked = false
    }
}

const removeFromInputRelate = (checkbox) => {

    let products = inputProducts.value.split(',')
    products = products.filter(product => product !== '')

    for(const i in products) {
        if(products[i].split('-')[0] === checkbox.id) products.splice(i, 1)
    }

    const newInputValue = products.join(',')
    inputProducts.value = newInputValue
}

const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'))
const products = inputProducts.value.split(',')
for(const i in products) {
    products[i] = products[i].split('-')
}
    checkboxes.forEach(checkbox => {
        for(const product of products) {
            if(product[0] === checkbox.id) checkbox.checked = true
        }
        checkbox.addEventListener('click', e => {
            if(e.target.checked) {
                addToInputRelate(e.target)
            } else {
                removeFromInputRelate(e.target)
            }
        })
    })



btnRegister.onclick = e => {
   
    if(inputProducts.value.split(',').filter(item => item !== '').length < 2) {
        return false
    } else {
        return true
    }
}