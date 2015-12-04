require([
    'base/js/namespace',
    'base/js/events',
    'codemirror/addon/search/search',
    'codemirror/addon/search/searchcursor',
    'codemirror/addon/dialog/dialog',
    'codemirror/addon/selection/active-line'],
    $([IPython.events]).on('app_initialized.NotebookApp', function() {

    IPython.CodeCell.options_default.cm_config.autoCloseBrackets = false;
    IPython.CodeCell.options_default.cm_config.lineNumbers = true;
    IPython.CodeCell.options_default.cm_config.cursorBlinkRate = 330;
    IPython.CodeCell.options_default.cm_config.lineWrapping = true;

    $('div#header-container').toggle();
    $('.header-bar').toggle(); // 1px high! WTF?!
    $('div#maintoolbar').toggle();
    Jupyter.menubar._size_header()

    IPython.keyboard_manager.command_shortcuts.add_shortcut('Alt-m', {
        help : 'toggle menu bar',
        help_index : 'zz',
        handler : function (event) {
            $('div#menubar-container').toggle();
            Jupyter.menubar._size_header();
            return false;
        }
    });

    IPython.keyboard_manager.command_shortcuts.add_shortcut('Alt-h', {
        help : 'toggle header',
        help_index : 'zz',
        handler : function (event) {
            $('div#header-container').toggle();
            $('.header-bar').toggle();
            Jupyter.menubar._size_header()
            return false;
        }
    });

    IPython.keyboard_manager.command_shortcuts.add_shortcut('Alt-c', {
        help : 'clear all output',
        help_index : 'zz',
        handler : function (event) {
            IPython.notebook.clear_all_output();
            return false;
        }
    });

    IPython.keyboard_manager.command_shortcuts.add_shortcut('Alt-x', {
        help : 'clear output',
        help_index : 'zz',
        handler : function (event) {
            IPython.notebook.clear_output();
            return false;
        }
    });

    IPython.keyboard_manager.command_shortcuts.add_shortcut('Alt-a', {
        help : 'merge cell above',
        help_index : 'zz',
        handler : function (event) {
            IPython.notebook.merge_cell_above();
            return false;
        }
    });

    IPython.keyboard_manager.command_shortcuts.add_shortcut('Alt-b', {
        help : 'merge cell below',
        help_index : 'zz',
        handler : function (event) {
            IPython.notebook.merge_cell_below();
            return false;
        }
    });

    IPython.keyboard_manager.edit_shortcuts.add_shortcut('Alt-s', {
        help : 'split cell',
        help_index : 'zz',
        handler : function (event) {
            IPython.notebook.split_cell();
            return false;
        }
    });

    IPython.keyboard_manager.command_shortcuts.add_shortcut('Alt-n', {
        help : 'toggle line number all cells',
        help_index : 'zz',
        handler : function (event) {
            var c = IPython.notebook.get_cells();
            for(var i in c){
                c[i].toggle_line_numbers();
            }
            return false;
        }
    });

    IPython.keyboard_manager.command_shortcuts.add_shortcut('Ctrl-up', {
        help : 'go to top cell',
        help_index : 'zz',
        handler : function (event) {
            IPython.notebook.select(0);
            IPython.notebook.scroll_to_top();
            return false;
        }
    });

    IPython.keyboard_manager.command_shortcuts.add_shortcut('Ctrl-down', {
        help : 'go to bottom cell',
        help_index : 'zz',
        handler : function (event) {
            var ncells = IPython.notebook.ncells();
            IPython.notebook.select(ncells-1);
            IPython.notebook.scroll_to_bottom();
            return false;
        }
    });

    IPython.keyboard_manager.command_shortcuts.add_shortcut('Alt-k', {
        help : 'move cell up',
        help_index : 'zz',
        handler : function (event) {
            IPython.notebook.move_cell_up();
            return false;
        }
    });

    IPython.keyboard_manager.command_shortcuts.add_shortcut('Alt-j', {
        help : 'move cell down',
        help_index : 'zz',
        handler : function (event) {
            IPython.notebook.move_cell_down();
            return false;
        }
    });
}));





$([IPython.events]).on('command_mode.Cell', function (event, data) {

      function clearRulers(cm) {
        for (var i = cm.display.lineSpace.childNodes.length - 1; i >= 0; i--) {
          var node = cm.display.lineSpace.childNodes[i];
          if (/(^|\s)CodeMirror-ruler($|\s)/.test(node.className))
            node.parentNode.removeChild(node);
        }
      }

      selected_cell = IPython.notebook.get_selected_cell();
        if ((selected_cell instanceof IPython.CodeCell)) {
            var cm = selected_cell.code_mirror;
            clearRulers(cm);
            cm.setOption('styleActiveLine', false);
        }

});

$([IPython.events]).on('edit_mode.Cell', function (event, data) {

    function setRulers(cm) {
        var val = cm.getOption("rulers");
        var cw = cm.defaultCharWidth();
        var left = cm.charCoords(CodeMirror.Pos(cm.firstLine(), 0), "div").left;
        var minH = cm.display.scroller.offsetHeight + 30;
        for (var i = 0; i < val.length; i++) {
          var elt = document.createElement("div");
          elt.className = "CodeMirror-ruler";
          var col, cls = null, conf = val[i];
          if (typeof conf == "number") {
            col = conf;
          } else {
            col = conf.column;
            if (conf.className) elt.className += " " + conf.className;
            if (conf.color) elt.style.borderColor = conf.color;
            if (conf.lineStyle) elt.style.borderLeftStyle = conf.lineStyle;
            if (conf.width) elt.style.borderLeftWidth = conf.width;
            cls = val[i].className;
          }
          elt.style.left = (left + col * cw) + "px";
          elt.style.top = "-60px";
          elt.style.bottom = "-20px";
          elt.style.minHeight = minH + "px";
          cm.display.lineSpace.insertBefore(elt, cm.display.cursorDiv);
        }
      }

    var ruler = [{column: 79}];

    selected_cell = IPython.notebook.get_selected_cell();
    if ((selected_cell instanceof IPython.CodeCell)) {
        var cm = selected_cell.code_mirror;
        cm.setOption('rulers', ruler);
        cm.setOption('styleActiveLine', true);
        setRulers(cm);
    }
});
