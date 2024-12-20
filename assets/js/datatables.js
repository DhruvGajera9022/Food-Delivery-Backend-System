$(document).ready(function () {
    $("#userstable").dataTable({
        order: [],
        columnDefs: [{ orderable: false, targets: [1, 8] }]
    });

    $("#roletable").dataTable({
        order: [],
        columnDefs: [{ orderable: false, targets: [3] }]
    })

    $("#categorytable").dataTable({
        order: [],
        columnDefs: [{ orderable: false, targets: [1, 4] }]
    })

    $("#productstable").dataTable({
        order: [],
        columnDefs: [{ orderable: false, targets: [1, 7] }]
    })

    $("#inovicetable").dataTable({
        order: [],
        columnDefs: [{ orderable: false, targets: [9] }]
    });

    $("#discounttable").dataTable({
        order: [],
        columnDefs: [{ orderable: false, targets: [1, 8] }]
    });

    $("#inovicedetailstable").dataTable({
        order: [],
        columnDefs: [{ orderable: false, targets: [1] }]
    });


    $("#privacy_policy").summernote({
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

    $("#term_condition").summernote({
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