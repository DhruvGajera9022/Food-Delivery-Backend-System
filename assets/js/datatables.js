$(document).ready(function () {

    $("#userstable").dataTable({
        order: [],
        columnDefs: [{ orderable: false, targets: [0, 8] }]
    });

    $("#roletable").dataTable({
        order: [],
        columnDefs: [{ orderable: false, targets: [2] }]
    })
});