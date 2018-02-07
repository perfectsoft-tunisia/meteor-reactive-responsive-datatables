Package.describe({
    name: 'perfectsofttunisia:reactive-responsive-datatables',
    summary: "Fast, responsive and reactive DataTables using Cursors / DataTables API. Supports Bootstrap 3.",
    version: "1.3.3",
    git: "https://github.com/perfectsoft-tunisia/meteor-reactive-responsive-datatables"
});

Package.onUse(function(api) {
    api.versionsFrom('1.3.5');
    api.use(['templating', 'jquery', 'ecmascript', 'underscore'], 'client');

    api.addFiles('responsive-helper.css', 'client');

    api.addAssets([
        'minus.png',
        'plus.png'
    ], 'client');
    api.mainModule('reactive-datatable-template.js', 'client');
});
