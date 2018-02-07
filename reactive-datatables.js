import {ResponsiveDatatablesHelper} from './responsive-helper.js';
import {$} from 'meteor/jquery';
import {_} from 'meteor/underscore';

var breakpointDefinition = {
	sm: 575,
	md: 767,
	lg: 991,
	xl: 1199
};

export const ReactiveDatatable = function(options) {
	var self = this;

	this.options = options = _.defaults(options, {
		// Any of these can be overriden by passing an options
		// object into your ReactiveDatatable template (see readme)
		stateSave: false,
		"sDom": "<'dt-toolbar clearfix'<'col-sm-6 col-xs-12 hidden-xs'l><'col-xs-12 col-sm-6'f>r>"+
					"t"+
					"<'dt-toolbar-footer clearfix'<'col-sm-6 col-xs-12 hidden-xs'i><'col-xs-12 col-sm-6'p>>",

	    "autoWidth" : true,
		"preDrawCallback" : function() {
			// Initialize the responsive datatables helper once.
			// console.log('self.responsiveHelper_dt_basic');
			// NOTE: This is where we have to inject the control attributes into each column header
            // to cause the responsive plugin to correctly mark them for hiding/etc.  We do this by
            // pushing all data-* attributes from the column definition as properties into the column
            var api = $(this).dataTable().api();
            for (var c = 0; c < options.columns.length; c++) {
                var columnDef = options.columns[c];
                var column = api.columns(c);
                // split out all data-X attributes into the column header
                for (var p in columnDef) {
                    if (columnDef.hasOwnProperty(p) && p.indexOf('data-') === 0) {
                        $(column.header()).attr(p, columnDef[p]);
                    }
                }
            }



			if (!this.responsiveHelper) {
				self.responsiveHelper = this.responsiveHelper = new ResponsiveDatatablesHelper(this, breakpointDefinition);
			}
		},
		"rowCallback" : function(nRow) {
			this.responsiveHelper.createExpandIcon(nRow);
		},
		"drawCallback" : function(table) {
			this.responsiveHelper.respond();
		},
		tableClasses: 'table-striped',
        pageLength: 20,
        lengthMenu: [
            [10, 20, 30, 40, 50, 100, -1],
            [10, 20, 30, 40, 50, 100, 'All']
        ],
		columnDefs: [{ // Global default blank value to avoid popup on missing data
			targets: '_all',
			defaultContent: '–––'
		}],
		stateLoadParams: function(settings, data) {
			// Make it easy to change to the stored page on .update()
			self.page = data.start / data.length;
		}
	});
};

ReactiveDatatable.prototype.update = function(data) {
	if (!data) return;
	var self = this;

	self.datatable
		.clear()
		.rows.add(data)
		.draw(false)
		.page(self.page || 0) // XXX: Can we avoid drawing twice?
		.draw(false);		  // I couldn't get the page drawing to work otherwise
};
