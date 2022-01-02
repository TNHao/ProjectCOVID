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
    console.log(userID)
    const password = document.getElementById('password').value;

    fetch(`${URL}/auth/login`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({ id: userID, password })
    }).then(res => res.json())
        .then(data => {
            const { status, msg, token } = data;
            if (status != 200) { alert(msg); return }

            localStorage.setItem("banking_token", token);
        })
        .catch(err => console.log(err))
}

const handleDeposit = (e) => {
    e.preventDefault();
    console.log(e);
} 