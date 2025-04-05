const username = document.getElementById("username");
const password = document.getElementById("password");

const login = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
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

const gotoSignup = () => {
  window.location.href = "../signup/signup.html";
};
