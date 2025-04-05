const username = document.getElementById("username");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");

const signup = async () => {
  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match");
    return;
  }
  try {
    const response = await fetch("http://localhost:3000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
      }),
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
      return;
    }
    localStorage.setItem("username", username.value);

    window.location.href = "../homepage/index.html";
  } catch (error) {
    console.log(error);
  }
};

const gotoLogin = () => {
  window.location.href = "../login/login.html";
};
