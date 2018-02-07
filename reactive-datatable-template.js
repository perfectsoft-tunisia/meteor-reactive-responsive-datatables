import {$} from 'meteor/jquery';
import {ReactiveDatatable} from './reactive-datatables.js';
import {Template} from 'meteor/templating';

import './reactive-datatable-template.html';

Template.ReactiveDatatable.onRendered(function() {
    var data = this.data;

    if (typeof data.tableData !== "function") {
        throw new Meteor.Error('Your tableData must be a function that returns an array via Cursor.fetch(), .map() or another (hopefully reactive) means');
    }

    var reactiveDataTable = this.reactiveDataTable = new ReactiveDatatable(data.options);

    // Help Blaze cleanly remove entire datatable when changing template / route by
    // wrapping table in existing element (#datatable_wrap) defined in the template.
    var table = document.createElement('table');
    var tableClasses = data.options.tableClasses || "";
    table.className = 'table dataTable ' + tableClasses;

    // Render the table element and turn it into a DataTable
    this.$('.datatable_wrapper').append(table);
    this.$table = $(table);
    this.$table.css({width: '100%'});
    var dt = this.$table.DataTable(data.options);
    reactiveDataTable.datatable = dt;

    dt.on('page.dt', function(e, settings) {
        var info = dt.page.info();
        reactiveDataTable.page = info.page;
    });

    this.autorun(function() {
        reactiveDataTable.update(data.tableData());
    });
});

Template.ReactiveDatatable.onDestroyed(function() {
    if (this.reactiveDataTable) {
        if (this.reactiveDataTable.responsiveHelper) {
            this.reactiveDataTable.responsiveHelper.disable(true);
        }
        this.reactiveDataTable.datatable.destroy();
    }
});