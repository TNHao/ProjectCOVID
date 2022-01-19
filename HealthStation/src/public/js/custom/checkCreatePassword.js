const createPasswordBtn = document.querySelector('.create-password-btn')
const check = () => {
  if (document.getElementById('inputPassword').value ==
    document.getElementById('inputConfirmPassword').value) {
    document.getElementById('message').style.color = 'green';
    document.getElementById('message').innerHTML = 'matching';
    createPasswordBtn.disabled = false;
  } else {
    document.getElementById('message').style.color = 'red';
    document.getElementById('message').innerHTML = 'not matching';
    createPasswordBtn.disabled = true;
  }
}