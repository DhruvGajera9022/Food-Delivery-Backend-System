$(document).ready(function () {
    let loginForm = $("#loginForm");
    let registerPage = $("#registerPage");
    let forgotPassForm = $("#forgotPassForm");
    let recoverPassForm = $("#recoverPassForm");

    loginForm.validate({
        rules: {
            email: {
                required: true,
            },
            password: {
                required: true,
            },
        },
        messages: { // Corrected 'message' to 'messages'
            email: {
                required: "Email is required",
            },
            password: {
                required: "Password is required",
            },
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element.closest(".input-group").next(".error-message"));
        }
    });

    registerPage.validate({
        rules: {
            fullname: {
                required: true,
            },
            email: {
                required: true,
            },
            password: {
                required: true,
            },
            confirmpassword: {
                required: true,
            },
        },
        messages: { // Corrected 'message' to 'messages'
            fullname: {
                required: "Name is required",
            },
            email: {
                required: "Email is required",
            },
            password: {
                required: "Password is required",
            },
            confirmpassword: {
                required: "Confirm-Password is required",
            },
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element.closest(".input-group").next(".error-message"));
        }
    });

    forgotPassForm.validate({
        rules: {
            email: {
                required: true,
            },
        },
        messages: { // Corrected 'message' to 'messages'
            email: {
                required: "Email is required",
            },
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element.closest(".input-group").next(".error-message"));
        }
    });

    recoverPassForm.validate({
        rules: {
            password: {
                required: true,
            },
            confirmpassword: {
                required: true,
            },
        },
        messages: {
            password: {
                required: "Password is required",
            },
            confirmpassword: {
                required: "Confirm-Password is required",
            },
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element.closest(".input-group").next(".error-message"));
        }
    });
});
