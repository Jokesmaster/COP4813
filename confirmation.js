const storedData = sessionStorage.getItem("cop4813FormData");

const errorDisplay = document.getElementById("confirmationError");

if (!storedData) {
    errorDisplay.textContent =
        "No form information was found. Please complete the form first.";
} else {
    const formData = JSON.parse(storedData);

    document.getElementById("confirmName").textContent =
        formData.firstName + " " + formData.lastName;

    document.getElementById("confirmAddress").textContent =
        formData.address + ", " +
        formData.city + ", " +
        formData.state + " " +
        formData.zip;

    document.getElementById("confirmPhone").textContent =
        formData.phone;

    document.getElementById("confirmEmail").textContent =
        formData.email;

    document.getElementById("confirmBirthdate").textContent =
        formData.birthdate;

    document.getElementById("confirmMessage").textContent =
        formData.message;
}

document.getElementById("backButton").addEventListener("click", function () {
    window.location.href = "form.html";
});

document.getElementById("confirmButton").addEventListener("click", function () {
    if (!storedData) {
        errorDisplay.textContent =
            "No form information was found. Please complete the form first.";
        return;
    }

    const formData = JSON.parse(storedData);

    const subject = "COP4813 Form Submission";

    const body =
        "Name: " + formData.firstName + " " + formData.lastName + "\n" +
        "Address: " + formData.address + ", " +
        formData.city + ", " +
        formData.state + " " +
        formData.zip + "\n" +
        "Phone: " + formData.phone + "\n" +
        "Email: " + formData.email + "\n" +
        "Birth Date: " + formData.birthdate + "\n\n" +
        "Message:\n" + formData.message;

    const mailtoLink =
        "mailto:yourname@example.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

    window.location.href = mailtoLink;
});