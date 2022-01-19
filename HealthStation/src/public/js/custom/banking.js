const URL = "http://localhost:5000";

const setLoading = () => {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('content').style.display = 'none';
}

const setLoaded = () => {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';
}

const userID = document.getElementById('user_id').innerHTML;

// ((id) => {
//     setLoading();

//     fetch(`${URL}/auth/verify`, {
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         },
//         method: "POST",
//         body: JSON.stringify({ id: id })
//     }).then(res => res.json())
//         .then(data => {
//             const { status, verified } = data;
//             if (status != 200) { alert('Something went wrong'); return }

//             if (verified)
//                 document.getElementById("newPasswordBtn").style.display = 'none';
//             else
//                 document.getElementById("loginBtn").style.display = 'none';

//             setLoaded();
//         })
//         .catch(err => console.log(err))
// })(userID)

const handleBankingConnect = () => {
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirmation').value;

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

    // console.log(bankingToken);

    // fetch(`/user/${userID}/set-token`, {
    //     method: "POST",
    //     body: JSON.stringify({ token: bankingToken })
    // })
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