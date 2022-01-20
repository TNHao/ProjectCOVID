const updateTotalPrice = () => {
    const productTotalPrice = Array.from(document.getElementsByClassName('product_total_price'));
    let total = 0;
    
    productTotalPrice.forEach(ele => total += Number(ele.innerHTML))
    
    document.getElementById('total').innerHTML = total;
    console.log(total);
    document.querySelector('#hidden-total-input').value = total;
}

const userInputs = Array.from(document.getElementsByClassName('user-input'));

// initial state
const hiddenTotalInput = document.querySelector('#hidden-total-input');
hiddenTotalInput.value = 0;
userInputs.forEach(userInput => {
    const { value, id } = userInput;
    let price = document.getElementById(`${id}_price`).innerText;
    const currentValue = Number(hiddenTotalInput.value)
    hiddenTotalInput.value = currentValue + Number(price);
})
document.getElementById('total').innerHTML = hiddenTotalInput.value

userInputs.forEach(
    userInput =>
        userInput.addEventListener('change',
            (event) => {
                const { value, id } = event.target;
                let price = document.getElementById(`${id}_price`).innerText;
                price = Number(value) * Number(price);

                document.getElementById(`${id}_total`).innerHTML = price;
                document.getElementById(`${id}_total_input`).value = price;
                updateTotalPrice();
            }
        )
)

