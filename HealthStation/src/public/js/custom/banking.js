// local
// const URL = "https://localhost:5000";

// deployment
const URL = "https://bank-system-hcmus.herokuapp.com";

const setLoading = () => {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('content').style.display = 'none';
}

const setLoaded = () => {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';
}

const userID = document.getElementById('user_id').innerHTML;


const handleBankingConnect = () => {
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirmation').value;

    if (password === "") {
        alert("Vui lòng nhập mật khẩu");
        return;
    }

    if (password !== passwordConfirm)
        return document.getElementById('registerPasswordError').innerHTML = "Mật khẩu không khớp.";
    else document.getElementById('registerPasswordError').innerHTML = "";

    fetch(`${URL}/auth/create-password`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({ id: userID, newPassword: password })
    }).then(res => res.json())
        .then(data => {
            const { status, msg } = data;
            if (status != 200) {
                alert(msg);
                location.reload();
                return
            }
        })
        .catch(err => console.log(err))

    location.reload();
}

const handleBankingLogin = async () => {
    const password = document.getElementById('password').value;

    let bankingToken = null;

    await fetch(`${URL}/auth/login`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({ id: userID, password: password })
    }).then(res => res.json())
        .then(data => {
            const { status, msg, token } = data;
            console.log(token);

            if (status != 200) {
                alert(msg);
                location.reload()
                return null
            }
            else
                return bankingToken = token;
        })
        .catch(err => console.log(err))

    console.log(bankingToken);

    fetch(`/user/${userID}/set-token`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({ token: bankingToken })
    })

    location.reload();
}

const handleDeposit = (e) => {
    e.preventDefault();
    console.log(e);
} 