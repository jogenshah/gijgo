﻿/** 
 * @widget Grid 
 * @plugin Resizable Columns
 */
gj.grid.plugins.resizableColumns = {
    config: {
        base: {
            /** If set to true, users can resize columns by dragging the edges (resize handles) of their header cells.
             * @type boolean
             * @default false
             * @example sample <!-- grid.base, draggable.base, grid.resizableColumns -->
             * <table id="grid"></table>
             * <script>
             *     var grid = $('#grid').grid({
             *         dataSource: '/DataSources/GetPlayers',
             *         resizableColumns: true,
             *         columns: [ { field: 'ID', width: 34 }, { field: 'Name' }, { field: 'PlaceOfBirth' } ]
             *     });
             * </script>
             */
            resizableColumns: false
        }
    },

    private: {
        init: function ($grid, config) {
            var $columns, $column, i, $wrapper, $resizer;
            $columns = $grid.find('thead tr th');
            if ($columns.length) {
                for (i = 0; i < $columns.length - 1; i++) {
                    $column = $($columns[i]);
                    $wrapper = $('<div class="gj-grid-base-column-resizer-wrapper" />');
                    $resizer = $('<span class="gj-grid-base-column-resizer" />');
                    if ($.fn.draggable) {
                        $resizer.draggable({
                            start: function () {
                                $grid.addClass('gj-grid-unselectable');
                                $grid.addClass('gj-grid-resize-cursor');
                            },
                            stop: function () {
                                $grid.removeClass('gj-grid-unselectable');
                                $grid.removeClass('gj-grid-resize-cursor');
                            },
                            drag: gj.grid.plugins.resizableColumns.private.createResizeHandle($grid, $column, config.columns[i])
                        });
                    }
                    $column.append($wrapper.append($resizer));
                }
            }
        },

        createResizeHandle: function ($grid, $column, column) {
            return function (e, offset) {
                var newWidth = $column.width() + offset.left + parseInt($column.css('paddingLeft').replace('px', ''), 10);
                column.width = newWidth;
                $column.width(newWidth);
            };
        }
    },

    public: {
    },

    configure: function ($grid, fullConfig, clientConfig) {
        $.extend(true, $grid, gj.grid.plugins.resizableColumns.public);
        if (fullConfig.resizableColumns) {
            $grid.on('initialized', function () {
                gj.grid.plugins.resizableColumns.private.init($grid, fullConfig);
            });
        }
    }
};
