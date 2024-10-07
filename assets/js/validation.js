$(document).ready(function () {
    let loginForm = $("#loginForm");
    let registerPage = $("#registerPage");
    let forgotPassForm = $("#forgotPassForm");
    let recoverPassForm = $("#recoverPassForm");
    let formAddUser = $("#formAddUser");
    let formAddRole = $("#formAddRole");

    loginForm.validate({
        rules: {
            email: {
                required: true,
            },
            password: {
                required: true,
            },
        },
        messages: {
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
        messages: {
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
        messages: {
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

    formAddUser.validate({
        rules: {
            fullName: {
                required: true,
            },
            email: {
                required: true,
            },
            password: {
                required: true,
            },
            cpassword: {
                required: true,
            },
            role: {
                required: true,
            },
        },
        messages: {

            fullName: {
                required: "Full Name is require",
            },
            email: {
                required: "Email is require",
            },
            password: {
                required: "Password is require",
            },
            cpassword: {
                required: "Confirm-Password is require",
            },
            role: {
                required: "Role is require",
            },
        }
    });

    formAddRole.validate({
        rules: {
            title: {
                required: true,
                minlength: 3
            },
            description: {
                required: false,
                minlength: 10
            }
        },
        messages: {
            title: {
                required: "Please enter a role title",
                minlength: "Title must be at least 3 characters long"
            },
            description: {
                minlength: "Description must be at least 10 characters long"
            }
        },
        errorElement: "span",
        errorPlacement: function (error, element) {
            error.addClass("invalid-feedback");
            element.closest(".form-group").find(".error-message").append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass("is-invalid").addClass("is-valid");
        }
    });
});
