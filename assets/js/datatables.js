$(document).ready(function () {
    $("#userstable").dataTable({
        order: [],
        columnDefs: [{ orderable: false, targets: [0, 7] }]
    });

    $("#roletable").dataTable({
        order: [],
        columnDefs: [{ orderable: false, targets: [2] }]
    })

    $("#categorytable").dataTable({
        order: [],
        columnDefs: [{ orderable: false, targets: [0, 3] }]
    })

    $("#productstable").dataTable({
        order: [],
        columnDefs: [{ orderable: false, targets: [0, 6] }]
    })

    $("#inovicetable").dataTable({});


    $("#settingsDecription").summernote({
        placeholder: "Write your content here",
        height: 70,
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture', 'video']],
            ['view', ['fullscreen', 'codeview', 'help']]
        ]
    });
});