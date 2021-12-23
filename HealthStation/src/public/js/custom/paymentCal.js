const updateTotalPrice = () => {
    const productTotalPrice = Array.from(document.getElementsByClassName('product_total_price'));
    let total = 0;
    
    productTotalPrice.forEach(ele => total += Number(ele.innerHTML))
    
    document.getElementById('total').innerHTML = total;
}

const userInputs = Array.from(document.getElementsByClassName('user-input'));

userInputs.forEach(
    userInput =>
        userInput.addEventListener('change',
            (event) => {
                const { value, id } = event.target;
                let price = document.getElementById(`${id}_price`).innerText;
                price = Number(value) * Number(price);

                document.getElementById(`${id}_total`).innerHTML = price;
                updateTotalPrice();
            }
        )
)

