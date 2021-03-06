﻿/** 
 * @widget Grid 
 * @plugin Expand Collapse Rows
 */
gj.grid.plugins.expandCollapseRows = {
    config: {
        base: {
            /** Template for the content in the detail section of the row.
             * Automatically add expand collapse column as a first column in the grid during initialization.
             * @type string
             * @default undefined
             * @example base.theme <!-- grid.base, grid.expandCollapseRows -->
             * <table id="grid"></table>
             * <script>
             *     $('#grid').grid({
             *         dataSource: '/DataSources/GetPlayers',
             *         detailTemplate: '<div><b>Place Of Birth:</b> {PlaceOfBirth}</div>',
             *         columns: [ { field: 'ID' }, { field: 'Name' }, { field: 'DateOfBirth', type: 'date' } ]
             *     });
             * </script>
             * @example bootstrap <!-- bootstrap, grid.base, grid.expandCollapseRows -->
             * <table id="grid"></table>
             * <script>
             *     $('#grid').grid({
             *         dataSource: '/DataSources/GetPlayers',
             *         uiLibrary: 'bootstrap',
             *         detailTemplate: '<div><b>Place Of Birth:</b> {PlaceOfBirth}</div>',
             *         columns: [ { field: 'ID' }, { field: 'Name' }, { field: 'DateOfBirth', type: 'date' } ]
             *     });
             * </script>
             */
            detailTemplate: undefined,

            style: {
                expandIcon: '',
                collapseIcon: ''
            }
        },
        jqueryui: {
            style: {
                expandIcon: 'ui-icon ui-icon-plus',
                collapseIcon: 'ui-icon ui-icon-minus'
            }
        },
        bootstrap: {
            style: {
                expandIcon: 'glyphicon glyphicon-plus',
                collapseIcon: 'glyphicon glyphicon-minus'
            }
        }
    },

    'private': {
        detailExpand: function ($grid, $cell) {
            var $contentRow = $cell.closest('tr'),
                $detailsRow = $('<tr data-role="details"></tr>'),
                $detailsCell = $('<td colspan="' + gj.grid.methods.countVisibleColumns($grid) + '"></td>'),
                data = $grid.data();

            $detailsRow.append($detailsCell.append($contentRow.data('details')));
            $detailsRow.insertAfter($contentRow);
            if (data.style.collapseIcon) {
                $cell.find('span').attr('class', data.style.collapseIcon);
            } else {
                $cell.find('div[data-role="display"]').text('-');
            }
            $cell.off('click').on('click', function (e) {
                e.stopPropagation();
                gj.grid.plugins.expandCollapseRows.private.detailCollapse($grid, $(this));
            });
            $grid.updateDetails($contentRow);
            gj.grid.plugins.expandCollapseRows.events.detailExpand($grid, $detailsRow.find('td>div'), $grid.get($contentRow.data('position')));
        },

        detailCollapse: function ($grid, $cell) {
            var $contentRow = $cell.closest('tr'),
                $detailsRow = $contentRow.next('tr[data-role="details"]'),
                data = $grid.data();
            $detailsRow.remove();
            if (data.style.expandIcon) {
                $cell.find('span').attr('class', data.style.expandIcon);
            } else {
                $cell.find('div[data-role="display"]').text('+');
            }
            $cell.off('click').on('click', function (e) {
                e.stopPropagation();
                gj.grid.plugins.expandCollapseRows.private.detailExpand($grid, $(this));
            });
            gj.grid.plugins.expandCollapseRows.events.detailCollapse($grid, $detailsRow.find('td>div'), $grid.get($contentRow.data('position')));
        },

        updateDetailsColSpan: function ($grid) {
            var $cells = $grid.find('tbody > tr[data-role="details"] > td');
            if ($cells && $cells.length) {
                $cells.attr('colspan', gj.grid.methods.countVisibleColumns($grid));
            }
        }
    },

    'public': {
        //TODO: add documentation
        collapseAll: function () {
            var $grid = this;
            $grid.find('tbody tr[data-role="row"]').each(function () {
                gj.grid.plugins.expandCollapseRows.private.detailCollapse($grid, $(this).find('td').first());
            });
        },

        //TODO: add documentation
        expandAll: function () {
            var $grid = this;
            $grid.find('tbody tr[data-role="row"]').each(function () {
                gj.grid.plugins.expandCollapseRows.private.detailExpand($grid, $(this).find('td').first());
            });
        },

        //TODO: add documentation
        updateDetails: function ($contentRow) {
            var $grid = this,
                $detailWrapper = $contentRow.data('details'),
                content = $detailWrapper.html(),
                record = $grid.get($contentRow.data('position'));

            $detailWrapper.html().replace(/\{(.+?)\}/g, function ($0, $1) {
                var column = gj.grid.methods.getColumnInfo($grid, $1);
                content = content.replace($0, gj.grid.methods.formatText(record[$1], column));
            });
            $detailWrapper.html(content);
        }
    },

    'events': {
        /**
         * Event fires when detail row is showing
         *
         * @event detailExpand
         * @param {object} e - event data
         * @param {object} detailWrapper - the detail wrapper as jQuery object 
         * @param {object} record - the data of the row record 
         * @example sample <!-- grid.base, grid.expandCollapseRows -->
         * <table id="grid"></table>
         * <script>
         *     var grid = $('#grid').grid({
         *         dataSource: '/DataSources/GetPlayers',
         *         detailTemplate: '<div></div>',
         *         columns: [ { field: 'ID' }, { field: 'Name' }, { field: 'DateOfBirth', type: 'date' } ]
         *     });
         *     grid.on('detailExpand', function (e, $detailWrapper, record) {
         *         $detailWrapper.empty().append('<b>Place Of Birth:</b> ' + record.PlaceOfBirth);
         *     });
         * </script>
         */
        detailExpand: function ($grid, $detailWrapper, record) {
            $grid.triggerHandler('detailExpand', [$detailWrapper, record]);
        },

        /**
         * Event fires when detail row is hiding
         *
         * @event detailCollapse
         * @param {object} e - event data
         * @param {object} detailWrapper - the detail wrapper as jQuery object 
         * @param {object} record - the data of the row record 
         * @example sample <!-- grid.base, grid.expandCollapseRows -->
         * <table id="grid"></table>
         * <script>
         *     var grid = $('#grid').grid({
         *         dataSource: '/DataSources/GetPlayers',
         *         detailTemplate: '<div></div>',
         *         columns: [ { field: 'ID' }, { field: 'Name' }, { field: 'DateOfBirth', type: 'date' } ]
         *     });
         *     grid.on('detailExpand', function (e, $detailWrapper, record) {
         *         $detailWrapper.append('<b>Place Of Birth:</b>' + record.PlaceOfBirth);
         *     });
         *     grid.on('detailCollapse', function (e, $detailWrapper, record) {
         *         $detailWrapper.empty();
         *         alert('detailCollapse is fired.');
         *     });
         * </script>
         */
        detailCollapse: function ($grid, $detailWrapper, record) {
            $grid.triggerHandler('detailCollapse', [$detailWrapper, record]);
        }
    },

    'configure': function ($grid) {
        var column, data = $grid.data();

        $.extend(true, $grid, gj.grid.plugins.expandCollapseRows.public);

        if (typeof (data.detailTemplate) !== 'undefined') {
            column = {
                title: '',
                field: data.primaryKey,
                width: (data.uiLibrary === 'bootstrap' ? 34 : 24),
                align: 'center',
                stopPropagation: true,
                events: {
                    'click': function () {
                        gj.grid.plugins.expandCollapseRows.private.detailExpand($grid, $(this));
                    }
                }
            };
            if (data.style.expandIcon) {
                column.type = 'icon';
                column.icon = data.style.expandIcon;
            } else {
                column.tmpl = '+';
                column.cssClass = 'gj-cursor-pointer';
            }
            data.columns = [column].concat(data.columns);

            $grid.on('rowDataBound', function (e, $row, id, record) {
                $row.data('details', $(data.detailTemplate));
            });
            $grid.on('columnShow', function (e, column) {
                gj.grid.plugins.expandCollapseRows.private.updateDetailsColSpan($grid);
            });
            $grid.on('columnHide', function (e, column) {
                gj.grid.plugins.expandCollapseRows.private.updateDetailsColSpan($grid);
            });
            $grid.on('rowRemoving', function (e, $row, id, record) {
                gj.grid.plugins.expandCollapseRows.private.detailCollapse($grid, $row.children('td').first());
            });
            $grid.on('dataBinding', function () {
                $grid.collapseAll();
            });
            $grid.on('pageChanging', function () {
                $grid.collapseAll();
            });
        }
    }
};