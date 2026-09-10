const form = document.getElementById("infoForm");
const phoneInput = document.getElementById("phone");
const birthdateInput = document.getElementById("birthdate");
const errorDisplay = document.getElementById("formError");

phoneInput.addEventListener("input", function () {
    let numbers = phoneInput.value.replace(/\D/g, "");

    if (numbers.length > 10) {
        numbers = numbers.substring(0, 10);
    }

    let formatted = "";

    if (numbers.length > 0) {
        formatted = "(" + numbers.substring(0, 3);
    }

    if (numbers.length >= 4) {
        formatted += ")" + numbers.substring(3, 6);
    }

    if (numbers.length >= 7) {
        formatted += "-" + numbers.substring(6, 10);
    }

    phoneInput.value = formatted;
});

form.addEventListener("submit", function (event) {
    event.preventDefault();

    errorDisplay.textContent = "";

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value;
    const zip = document.getElementById("zip").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const birthdate = birthdateInput.value;
    const message = document.getElementById("message").value.trim();
    const security = document.getElementById("security").value.trim();

    const zipPattern = /^\d{5}$/;
    const phonePattern = /^\(\d{3}\)\d{3}-\d{4}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
        firstName === "" ||
        lastName === "" ||
        address === "" ||
        city === "" ||
        state === "" ||
        zip === "" ||
        phone === "" ||
        email === "" ||
        birthdate === "" ||
        message === "" ||
        security === ""
    ) {
        showError("Please complete all required fields.");
        return;
    }

    if (!zipPattern.test(zip)) {
        showError("Please enter a valid 5-digit ZIP code.");
        return;
    }

    if (!phonePattern.test(phone)) {
        showError("Please enter a complete 10-digit phone number.");
        return;
    }

    if (!emailPattern.test(email)) {
        showError("Please enter a valid email address.");
        return;
    }

    const birthDateObject = new Date(birthdate + "T00:00:00");
    const today = new Date();

    if (birthDateObject > today) {
        showError("Birth date cannot be in the future.");
        return;
    }

    const oldestReasonableDate = new Date();
    oldestReasonableDate.setFullYear(today.getFullYear() - 120);

    if (birthDateObject < oldestReasonableDate) {
        showError("Please enter a reasonable birth date.");
        return;
    }

    if (!["19", "21"].includes(security)) {
    showError("The security question is incorrect.");
    return;
}
    }

    const formData = {
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        state: state,
        zip: zip,
        phone: phone,
        email: email,
        birthdate: birthdate,
        message: message
    };

    sessionStorage.setItem("cop4813FormData", JSON.stringify(formData));

    window.location.href = "confirmation.html";
});

function showError(message) {
    errorDisplay.textContent = message;
    errorDisplay.focus();
}