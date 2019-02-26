"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

// (function() {
var selectedElement;
var inputValue = ''; // Add an option for your plugin.

$.FroalaEditor.DEFAULTS = $.extend($.FroalaEditor.DEFAULTS, {
  buttonToolbarOptions: [],
  containerToolbar: []
});
$.extend($.FroalaEditor.POPUP_TEMPLATES, {
  "customPlugin.popup": '[_BUTTONS_][_CUSTOM_LAYER_]'
});
$.extend($.FroalaEditor.POPUP_TEMPLATES, {
  "div.edit": '[_BUTTONS_]'
}); // Define popup buttons.

$.extend($.FroalaEditor.DEFAULTS, {
  popupButtons: ['popupClose', 'buttonInfo']
});

$.FroalaEditor.PLUGINS.containerToolbar = function (editor) {
  var private_var = 'Container Toolbar Options';

  function _privateMethod() {
    console.log(private_var);
  }

  function publicMethod() {
    _privateMethod();
  }

  function _init() {
    $('#froala-editor').click(function (e) {
      console.log($(e.target)[0].outerHTML);

      if ($($(e.target)[0].outerHTML).attr('name') === 'moe-container' || $($(e.target)[0].outerHTML).attr('class') === 'container') {
        var buttons = '<div class="fr-buttons">' + editor.button.buildList(editor.opts.containerToolbar) + '</div>';
        editor.popups.create('div.edit', {
          buttons: buttons
        });
        editor.popups.show('div.edit');
        editor.popups.hide('forms.edit');
        console.log(editor.image);
      }
    });
  }

  return {
    _init: _init,
    publicMethod: publicMethod
  };
}; // The custom popup is defined inside a plugin (new or existing).


$.FroalaEditor.PLUGINS.customPlugin = function (editor) {
  console.log(editor);
  var parser = new DOMParser();
  var html = parser.parseFromString(editor.$tb[0].outerHTML, 'text/html');
  $(html).ready(function () {
    $('div.fr-separator.fr-hs, .fr-separator.fr-vs').remove(); // $('<div class="fr-separator fr-hs" role="separator" orientation="horizontal">').insertBefore($('.fr-toolbar button.fr-command.fr-btn:nth-child(8)'));

    $("div.fr-toolbar.fr-desktop.fr-inline").prepend('<span style="left: 10px">Text</span>');
    $('<div class="fr-separator fr-hs" role="separator" orientation="horizontal"></div>').insertBefore($('.fr-toolbar button.fr-command.fr-btn:nth-child(6)'));
  });
  $('div.fr-toolbar.fr-desktop.fr-inline').css('display', 'flex');
  $('div.fr-toolbar.fr-desktop.fr-inline').css('align-items', 'center');
  $('div.fr-toolbar.fr-desktop.fr-inline').css('flex-wrap', 'wrap');
  $('div.fr-toolbar.fr-desktop.fr-inline').css('width', '600px');
  var selectedElement;
  var inputValue; // Create custom popup.

  function initPopup(customTemplate) {
    // Popup buttons.
    var popup_buttons = '';
    selectedElement = editor.forms.getInput(); // Create the list of buttons.

    if (editor.opts.popupButtons.length > 1) {
      popup_buttons += '<div class="fr-buttons">';
      popup_buttons += editor.button.buildList(editor.opts.popupButtons);
      popup_buttons += '</div>';
    } // Load popup template.


    var template = {
      buttons: [],
      custom_layer: customTemplate ? customTemplate : '<div class="fr-my-layer fr-layer fr-active" id="fr-my-layer-' + editor.id + '"><div class="fr-input-line"><input id="fr-my-layer-text-' + editor.id + '" type="text" placeholder="' + editor.language.translate('Enter border radius') + '" tabIndex="1"></div></div>' + popup_buttons
    }; // Create popup.

    var $popup = editor.popups.create('customPlugin.popup', template);
    return $popup;
  } // Show the popup


  function showPopup() {
    var $popup = editor.popups.get('customPlugin.popup'); // If popup doesn't exist then create it.
    // To improve performance it is best to create the popup when it is first needed
    // and not when the editor is initialized.

    if (!$popup) $popup = initPopup(); // Set the editor toolbar as the popup's container.

    editor.popups.setContainer('customPlugin.popup', editor.$tb); // This will trigger the refresh event assigned to the popup.
    // editor.popups.refresh('customPlugin.popup');
    // This custom popup is opened by pressing a button from the editor's toolbar.
    // Get the button's object in order to place the popup relative to it.

    var $btn = editor.$sc.find('.fr-command[data-cmd="my_dropdown"]');
    var parser = new DOMParser();
    var html = parser.parseFromString(editor.popups.get('forms.edit')[0].outerHTML, 'text/html');
    $(html).ready(function () {
      $('span.fr-arrow').remove();
      $("div.fr-popup.fr-desktop.fr-inline.fr-above.fr-active").css('border-bottom', "1px solid #ccc");
    }); // Set the popup's position.

    var left = $btn.offset().left * 2 + $btn.outerWidth();
    var top = $btn.offset().top + (editor.opts.toolbarBottom ? 10 : $btn.outerHeight()); // Show the custom popup.
    // The button's outerHeight is required in case the popup needs to be displayed above it.

    editor.popups.show('customPlugin.popup', left, 590, 30);
    editor.popups.get('forms.edit')[0].style.display = 'block'; // editor.popups.show('forms.edit', 10, 20, 30);
  } // Hide the custom popup.


  function hidePopup() {
    editor.popups.hide('customPlugin.popup');
  }

  function popUpUpdateButonClick() {
    var html = $("#fr-my-layer-text-" + editor.id).val();
    selectedElement.style.borderRadius = html + 'px';
  }

  function changeBackgroundColor() {
    var html = $("#fr-my-layer-text-" + editor.id).val();

    if (selectedElement) {
      selectedElement.style.backgroundColor = html;
    }
  }

  function createPopUpWithCustomHTML(customHTML, type) {
    initPopup(customHTML);
    $(".fa.fa-arrow-left").on('click', function () {
      editor.popups.get("customPlugin.popup")[0].style.display = "none";
      editor.popups.get("customPlugin.popup")[0].outerHTML = '';
    });

    if (type === 'resize') {
      $("#fr-my-layer-range-text-1")[0].min = 0;
      $("#fr-my-layer-range-text-1")[0].max = 100;
      $("#fr-my-layer-range-text-2")[0].min = 0;
      $("#fr-my-layer-range-text-2")[0].max = 100;
      $("#fr-editor-button-size-width")[0].innerHTML = "<span>".concat($("#fr-my-layer-range-text-1").val(), "%</span>");
      $("#fr-editor-button-size-height")[0].innerHTML = "<span>".concat($("#fr-my-layer-range-text-2").val(), "%</span>");
      $('input[type="range"]').on('input', function () {
        var val = ($(this).val() - $(this).attr('min')) / ($(this).attr('max') - $(this).attr('min'));
        $(this).css('background-image', '-webkit-gradient(linear, left top, right top, ' + 'color-stop(' + val + ', #14bfaf), ' + 'color-stop(' + val + ', #eeeeee)' + ')');
      }); // Get the popup object defined above.

      document.getElementById("fr-my-layer-range-text-1").addEventListener('input', function () {
        selectedElement.style.width = $("#fr-my-layer-range-text-1").val() + '%';
        $("#fr-editor-button-size-width")[0].innerHTML = "<span>".concat($("#fr-my-layer-range-text-1").val(), "%</span>");
      });
      document.getElementById("fr-my-layer-range-text-2").addEventListener('input', function () {
        selectedElement.style.height = $("#fr-my-layer-range-text-2").val() + 'px';
        $("#fr-editor-button-size-height")[0].innerHTML = "<span>".concat($("#fr-my-layer-range-text-2").val(), "%</span>");
      });
      $("#close-resize-popup").on('click', function () {
        editor.popups.get("customPlugin.popup")[0].style.display = "none";
        editor.popups.get("customPlugin.popup")[0].outerHTML = '';
      });
    } else if (type === 'shadow') {
      document.getElementById("updateShadow").addEventListener('click', function () {
        var shadowVal = $("#fr-shadow-input").val() + 'px';
        selectedElement.style.boxShadow = "".concat(shadowVal, " ").concat(shadowVal, " ").concat(shadowVal, " ").concat(shadowVal, " #ccc");
      });
    } else if (type === 'rounded') {
      $("#clear-border-radius-input").on('click', function () {
        $('#border-radius-input').val("");
        selectedElement.style.borderRadius = '0';
      });
      $('#border-radius-input').on('input', function () {
        selectedElement.style.borderRadius = "".concat($(this).val(), "px");
      });
    } else if (type === 'boxShadow') {
      $('#box-shadow-input, #box-shadow-color-input').on('input', function () {
        // $('div.container').css('border', `${$('#box-shadow-input').val()}px outset ${$('#box-shadow-color-input').val()}`);
        $('div.container').css('box-shadow', "0 0 ".concat($('#box-shadow-input').val(), "px ").concat($('#box-shadow-color-input').val()));
      });
    } else if (type === "scaleContainer") {
      $("#fr-scale-container-input").on('input', function () {
        $('div.container').css('transform', "scale(".concat($("#fr-scale-container-input").val() / 10, ")"));
        $("#fr-editor-container-size")[0].innerHTML = "<span>".concat($("#fr-scale-container-input").val() * 5, "%</span>");
      }); // fr-scale-container-input
    } else if (type === 'containerBackground') {
      $(".color-picker-custom").on('click', function () {
        $('div.container').css('background-color', "".concat($(this).attr('id')));
      });
      $("#custom-color-select-button").on('click', function () {
        $('div.container').css('background-color', "".concat($("#custom-color-input-container").val()));
      });
    } // editor.popups.onHide('customPlugin.popup', function() {
    //   editor.popups.get('customPlugin.popup')[0].outerHTML = '';
    // });
    // editor.popups.onHide('forms.edit', function() {
    //   editor.popups.get('forms.edit')[0].outerHTML = '';
    // })

  } // Methods visible outside the plugin.


  return {
    showPopup: showPopup,
    hidePopup: hidePopup,
    popUpUpdateButonClick: popUpUpdateButonClick,
    createPopUpWithCustomHTML: createPopUpWithCustomHTML,
    changeBackgroundColor: changeBackgroundColor
  };
}; // Define the plugin.
// The editor parameter is the current instance.


$.FroalaEditor.PLUGINS.buttonToolbarOptions = function (editor) {
  // Private variable visible only inside the plugin scope.
  var private_var = 'Button Toolbar Plugin'; // _build('form.edit', )
  // Private method that is visible only inside plugin scope.

  function _privateMethod() {
    console.log(private_var);
  } // Public method that is visible in the instance scope.


  function publicMethod() {
    console.log(_privateMethod());
  } // The start point for your plugin.


  function _init() {
    editor.popups._init(); // You can access any option from documentation or your custom options.


    editor.opts.formEditButtons = _toConsumableArray(editor.opts.buttonToolbarOptions);
    var defaultButtonsHtml = '';
    var parser = new DOMParser();
    editor.popups.create('forms.edit');
    defaultButtonsHtml = editor.popups.get('forms.edit')[0].outerHTML;
    var html = parser.parseFromString(defaultButtonsHtml, 'text/html');
    var editorButtons = editor.$tb[0].children;
    $(html).ready(function () {
      $('div.fr-separator.fr-hs, .fr-separator.fr-vs').remove();
      $("div.fr-buttons").prepend('<span style="position: relative; bottom: 12px; left: 12px; margin-right: 20px;">Button</span>');
      $('<div class="fr-separator fr-hs" role="separator" orientation="horizontal"></div><span id="title-text" style="position: relative; bottom: 12px; left: 12px; margin-right: 20px;">Text</span>').insertBefore($('.fr-popup button.fr-command.fr-btn:nth-child(6)'));
    });
    $('div.fr-buttons').css('display', 'flex');
    $('div.fr-buttons').css('align-items', 'center');
    $('div.fr-buttons').css('flex-wrap', 'wrap');
    $('div.fr-buttons').css('width', '600px');
    editor.popups.get('forms.edit')[0].style.marginTop = '120px';
    var buttons = '<div class="fr-buttons">' + editor.button.buildList(editor.opts.formEditButtons) + '</div>';
    editor.popups.create('forms.edit', {
      buttons: buttons
    });
    editor.popups.onShow('forms.edit', function () {
      editor.selection = { ...editor.selection,
        element: function element() {
          if (editor.forms.getInput()) {
            return editor.forms.getInput();
          }

          return editor.selection.element();
        },
        blocks: function blocks() {
          if (editor.forms.getInput()) {
            return [editor.forms.getInput()];
          }

          return editor.selection.element();
        }
      };
      editor.align = { ...editor.align,
        apply: function apply(val) {
          editor.forms.getInput().style.textAlign = val;
        }
      };
      editor.fontFamily = { ...editor.fontFamily,
        apply: function apply(val) {
          editor.forms.getInput().style.fontFamily = val;
        }
      };
      editor.fontSize = { ...editor.fontSize,
        apply: function apply(val) {
          editor.forms.getInput().style.fontSize = val;
        }
      };
    });
    editor.popups.onShow('text.edit', function () {
      editor.popups.hide('forms.edit');
    });
  }

  return {
    _init: _init,
    publicMethod: publicMethod
  };
};
/*!
* froala_editor v2.9.1 (https://www.froala.com/wysiwyg-editor)
* License https://froala.com/wysiwyg-editor/terms/
* Copyright 2014-2018 Froala Labs
*/


(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object' && module.exports) {
    // Node/CommonJS
    module.exports = function (root, jQuery) {
      if (jQuery === undefined) {
        // require('jQuery') returns a factory that requires window to
        // build a jQuery instance, we normalize how we use modules
        // that require this pattern but the window provided is a noop
        // if it's defined (how jquery works)
        if (typeof window !== 'undefined') {
          jQuery = require('jquery');
        } else {
          jQuery = require('jquery')(root);
        }
      }

      return factory(jQuery);
    };
  } else {
    // Browser globals
    factory(window.jQuery);
  }
})(function ($) {
  $.extend($.FE.POPUP_TEMPLATES, {
    'colors.picker': '[_BUTTONS_][_TEXT_COLORS_][_BACKGROUND_COLORS_][_CUSTOM_COLOR_]'
  }); // Extend defaults.

  $.extend($.FE.DEFAULTS, {
    colorsText: ['#61BD6D', '#1ABC9C', '#54ACD2', '#2C82C9', '#9365B8', '#475577', '#CCCCCC', '#41A85F', '#00A885', '#3D8EB9', '#2969B0', '#553982', '#28324E', '#000000', '#F7DA64', '#FBA026', '#EB6B56', '#E25041', '#A38F84', '#EFEFEF', '#FFFFFF', '#FAC51C', '#F37934', '#D14841', '#B8312F', '#7C706B', '#D1D5D8', 'REMOVE'],
    colorsBackground: ['#61BD6D', '#1ABC9C', '#54ACD2', '#2C82C9', '#9365B8', '#475577', '#CCCCCC', '#41A85F', '#00A885', '#3D8EB9', '#2969B0', '#553982', '#28324E', '#000000', '#F7DA64', '#FBA026', '#EB6B56', '#E25041', '#A38F84', '#EFEFEF', '#FFFFFF', '#FAC51C', '#F37934', '#D14841', '#B8312F', '#7C706B', '#D1D5D8', 'REMOVE'],
    colorsStep: 7,
    colorsHEXInput: true,
    colorsDefaultTab: 'text',
    colorsButtons: ['colorsBack', '|', '-']
  });

  $.FE.PLUGINS.colors = function (editor) {
    /*
     * Show the colors popup.
     */
    function _showColorsPopup() {
      var $btn = editor.$sc.find('.fr-command[data-cmd="color"]');
      var $popup = editor.popups.get('colors.picker');
      if (!$popup) $popup = _initColorsPopup();

      if (!$popup.hasClass('fr-active')) {
        // Colors popup
        editor.popups.setContainer('colors.picker', editor.$tb); // Refresh selected color.

        _refreshColor($popup.find('.fr-selected-tab').attr('data-param1')); // Colors popup left and top position.


        if ($btn.is(':visible')) {
          var left = $btn.offset().left + $btn.outerWidth() / 2;
          var top = $btn.offset().top + (editor.opts.toolbarBottom ? 10 : $btn.outerHeight() - 10);
          editor.popups.show('colors.picker', left, top, $btn.outerHeight());
        } else {
          editor.position.forSelection($popup);
          editor.popups.show('colors.picker');
        }
      }
    }
    /*
     * Hide colors popup.
     */


    function _hideColorsPopup() {
      // Hide popup.
      editor.popups.hide('colors.picker');
    }
    /**
     * Init the colors popup.
     */


    function _initColorsPopup() {
      var colors_buttons = '<div class="fr-buttons fr-colors-buttons">';

      if (editor.opts.toolbarInline) {
        // Colors buttons.
        if (editor.opts.colorsButtons.length > 0) {
          colors_buttons += editor.button.buildList(editor.opts.colorsButtons);
        }
      }

      colors_buttons += _colorsTabsHTML() + '</div>'; // Custom HEX.

      var custom_color = '';

      if (editor.opts.colorsHEXInput) {
        custom_color = '<div class="fr-color-hex-layer fr-active fr-layer" id="fr-color-hex-layer-' + editor.id + '"><div class="fr-input-line"><input maxlength="7" id="fr-color-hex-layer-text-' + editor.id + '" type="text" placeholder="' + editor.language.translate('HEX Color') + '" tabIndex="1" aria-required="true"></div><div class="fr-action-buttons"><button type="button" class="fr-command fr-submit" data-cmd="customColor" tabIndex="2" role="button">' + editor.language.translate('OK') + '</button></div></div>';
      }

      var template = {
        buttons: colors_buttons,
        text_colors: _colorPickerHTML('text'),
        background_colors: _colorPickerHTML('background'),
        custom_color: custom_color
      }; // Create popup.

      var $popup = editor.popups.create('colors.picker', template);

      _addAccessibility($popup);

      return $popup;
    }
    /*
     * HTML for the color picker text and background tabs.
     */


    function _colorsTabsHTML() {
      var tabs_html = '<div class="fr-colors-tabs fr-group">'; // Text tab.

      tabs_html += '<span class="fr-colors-tab ' + (editor.opts.colorsDefaultTab == 'background' ? '' : 'fr-selected-tab ') + 'fr-command" tabIndex="-1" role="button" aria-pressed="' + (editor.opts.colorsDefaultTab == 'background' ? false : true) + '" data-param1="text" data-cmd="colorChangeSet" title="' + editor.language.translate('Text') + '">' + editor.language.translate('Text') + '</span>'; // Background tab.

      tabs_html += '<span class="fr-colors-tab ' + (editor.opts.colorsDefaultTab == 'background' ? 'fr-selected-tab ' : '') + 'fr-command" tabIndex="-1" role="button" aria-pressed="' + (editor.opts.colorsDefaultTab == 'background' ? true : false) + '" data-param1="background" data-cmd="colorChangeSet" title="' + editor.language.translate('Background') + '">' + editor.language.translate('Background') + '</span>';
      return tabs_html + '</div>';
    }
    /*
     * HTML for the color picker colors.
     */


    function _colorPickerHTML(tab) {
      // Get colors according to tab name.
      var colors = tab == 'text' ? editor.opts.colorsText : editor.opts.colorsBackground; // Create colors html.

      var colors_html = '<div class="fr-color-set fr-' + tab + '-color' + (editor.opts.colorsDefaultTab == tab || editor.opts.colorsDefaultTab != 'text' && editor.opts.colorsDefaultTab != 'background' && tab == 'text' ? ' fr-selected-set' : '') + '">'; // Add colors.

      for (var i = 0; i < colors.length; i++) {
        if (i !== 0 && i % editor.opts.colorsStep === 0) {
          colors_html += '<br>';
        }

        if (colors[i] != 'REMOVE') {
          colors_html += '<span class="fr-command fr-select-color" style="background: ' + colors[i] + ';" tabIndex="-1" aria-selected="false" role="button" data-cmd="' + tab + 'Color" data-param1="' + colors[i] + '"><span class="fr-sr-only">' + editor.language.translate('Color') + ' ' + colors[i] + '&nbsp;&nbsp;&nbsp;</span></span>';
        } else {
          colors_html += '<span class="fr-command fr-select-color" data-cmd="' + tab + 'Color" tabIndex="-1" role="button" data-param1="REMOVE" title="' + editor.language.translate('Clear Formatting') + '">' + editor.icon.create('remove') + '<span class="fr-sr-only">' + editor.language.translate('Clear Formatting') + '</span>' + '</span>';
        }
      }

      return colors_html + '</div>';
    }
    /*
     * Register keyboard events.
     */


    function _addAccessibility($popup) {
      // Register popup event.
      editor.events.on('popup.tab', function (e) {
        var $focused_item = $(e.currentTarget); // Skip if popup is not visible or focus is elsewere.

        if (!editor.popups.isVisible('colors.picker') || !$focused_item.is('span')) {
          return true;
        }

        var key_code = e.which;
        var status = true; // Tabbing.

        if ($.FE.KEYCODE.TAB == key_code) {
          var $tb = $popup.find('.fr-buttons'); // Focus back the popup's toolbar if exists.

          status = !editor.accessibility.focusToolbar($tb, e.shiftKey ? true : false);
        } // Arrows.
        else if ($.FE.KEYCODE.ARROW_UP == key_code || $.FE.KEYCODE.ARROW_DOWN == key_code || $.FE.KEYCODE.ARROW_LEFT == key_code || $.FE.KEYCODE.ARROW_RIGHT == key_code) {
            if ($focused_item.is('span.fr-select-color')) {
              // Get all current colors.
              var $colors = $focused_item.parent().find('span.fr-select-color'); // Get focused item position.

              var index = $colors.index($focused_item); // Get color matrix dimensions.

              var columns = editor.opts.colorsStep;
              var lines = Math.floor($colors.length / columns); // Get focused item coordinates.

              var column = index % columns;
              var line = Math.floor(index / columns);
              var nextIndex = line * columns + column;
              var dimension = lines * columns; // Calculate next index. Go to the other opposite site of the matrix if there is no next adjacent element.
              // Up/Down: Traverse matrix lines.
              // Left/Right: Traverse the matrix as it is a vector.

              if ($.FE.KEYCODE.ARROW_UP == key_code) {
                nextIndex = ((nextIndex - columns) % dimension + dimension) % dimension; // Javascript negative modulo bug.
              } else if ($.FE.KEYCODE.ARROW_DOWN == key_code) {
                nextIndex = (nextIndex + columns) % dimension;
              } else if ($.FE.KEYCODE.ARROW_LEFT == key_code) {
                nextIndex = ((nextIndex - 1) % dimension + dimension) % dimension; // Javascript negative modulo bug.
              } else if ($.FE.KEYCODE.ARROW_RIGHT == key_code) {
                nextIndex = (nextIndex + 1) % dimension;
              } // Get the next element based on the new index.


              var $el = $($colors.get(nextIndex)); // Focus.

              editor.events.disableBlur();
              $el.focus();
              status = false;
            }
          } // ENTER or SPACE.
          else if ($.FE.KEYCODE.ENTER == key_code) {
              editor.button.exec($focused_item);
              status = false;
            } // Prevent propagation.


        if (status === false) {
          e.preventDefault();
          e.stopPropagation();
        }

        return status;
      }, true);
    }
    /*
     * Show the current selected color.
     */


    function _refreshColor(tab) {
      var $popup = editor.popups.get('colors.picker');
      var $element = $(editor.selection.element()); // The color css property.

      var color_type;

      if (tab == 'background') {
        color_type = 'background-color';
      } else {
        color_type = 'color';
      }

      var $current_color = $popup.find('.fr-' + tab + '-color .fr-select-color'); // Remove current color selection.

      $current_color.find('.fr-selected-color').remove();
      $current_color.removeClass('fr-active-item');
      $current_color.not('[data-param1="REMOVE"]').attr('aria-selected', false); // Find the selected color.

      while ($element.get(0) != editor.el) {
        // Transparent or black.
        if ($element.css(color_type) == 'transparent' || $element.css(color_type) == 'rgba(0, 0, 0, 0)') {
          $element = $element.parent();
        } // Select the correct color.
        else {
            var $select_color = $popup.find('.fr-' + tab + '-color .fr-select-color[data-param1="' + editor.helpers.RGBToHex($element.css(color_type)) + '"]'); // Add checked icon.

            $select_color.append("<span class=\"fr-selected-color\" aria-hidden=\"true\">\uF00C</span>");
            $select_color.addClass('fr-active-item').attr('aria-selected', true);
            break;
          }
      }

      var $input = $popup.find('.fr-color-hex-layer input');

      if ($input.length) {
        $input.val(editor.helpers.RGBToHex($element.css(color_type))).trigger('change');
      }
    }
    /*
     * Change the colors' tab.
     */


    function _changeSet($tab, val) {
      // Only on the tab that is not selected yet. On left click only.
      if (!$tab.hasClass('fr-selected-tab')) {
        // Switch selected tab.
        $tab.siblings().removeClass('fr-selected-tab').attr('aria-pressed', false);
        $tab.addClass('fr-selected-tab').attr('aria-pressed', true); // Switch the color set.

        $tab.parents('.fr-popup').find('.fr-color-set').removeClass('fr-selected-set');
        $tab.parents('.fr-popup').find('.fr-color-set.fr-' + val + '-color').addClass('fr-selected-set'); // Refresh selected color.

        _refreshColor(val);
      } // Focus popup.


      editor.accessibility.focusPopup($tab.parents('.fr-popup'));
    }
    /*
     * Change background color.
     */


    function background(val) {
      // Set background  color.
      if (val != 'REMOVE') {
        editor.forms.getInput().style.backgroundColor = editor.helpers.HEXtoRGB(val);
      } // Remove background color.
      else {
          editor.format.removeStyle('background-color');
        }

      _hideColorsPopup();
    }
    /*
     * Change text color.
     */


    function text(val) {
      // Set text color.
      if (val != 'REMOVE') {
        editor.forms.getInput().style.color = editor.helpers.HEXtoRGB(val);
      } // Remove text color.
      else {
          editor.format.removeStyle('color');
        }

      _hideColorsPopup();
    }
    /*
     * Go back to the inline editor.
     */


    function back() {
      editor.popups.hide('colors.picker');
      editor.toolbar.showInline();
    }

    function customColor() {
      var $popup = editor.popups.get('colors.picker');
      var $input = $popup.find('.fr-color-hex-layer input');

      if ($input.length) {
        var color = $input.val();
        var tab = $popup.find('.fr-selected-tab').attr('data-param1');

        if (tab == 'background') {
          background(color);
        } else {
          text(color);
        }
      }
    }

    return {
      showColorsPopup: _showColorsPopup,
      hideColorsPopup: _hideColorsPopup,
      changeSet: _changeSet,
      background: background,
      customColor: customColor,
      text: text,
      back: back
    };
  }; // Toolbar colors button.


  $.FE.DefineIcon('colors', {
    NAME: 'tint'
  });
  $.FE.RegisterCommand('color', {
    title: 'Colors',
    undo: false,
    focus: true,
    refreshOnCallback: false,
    popup: true,
    callback: function callback() {
      if (!this.popups.isVisible('colors.picker')) {
        this.colors.showColorsPopup();
      } else {
        if (this.$el.find('.fr-marker').length) {
          this.events.disableBlur();
          this.selection.restore();
        }

        this.popups.hide('colors.picker');
      }
    },
    plugin: 'colors'
  }); // Select text color command.

  $.FE.RegisterCommand('textColor', {
    undo: true,
    callback: function callback(cmd, val) {
      this.colors.text(val);
    }
  }); // Select background color command.

  $.FE.RegisterCommand('backgroundColor', {
    undo: true,
    callback: function callback(cmd, val) {
      this.colors.background(val);
    }
  });
  $.FE.RegisterCommand('colorChangeSet', {
    undo: false,
    focus: false,
    callback: function callback(cmd, val) {
      var $tab = this.popups.get('colors.picker').find('.fr-command[data-cmd="' + cmd + '"][data-param1="' + val + '"]');
      this.colors.changeSet($tab, val);
    }
  }); // Colors back.

  $.FE.DefineIcon('colorsBack', {
    NAME: 'arrow-left'
  });
  $.FE.RegisterCommand('colorsBack', {
    title: 'Back',
    undo: false,
    focus: false,
    back: true,
    refreshAfterCallback: false,
    callback: function callback() {
      this.colors.back();
    }
  });
  $.FE.RegisterCommand('customColor', {
    title: 'OK',
    undo: true,
    callback: function callback() {
      this.colors.customColor();
    }
  });
  $.FE.DefineIcon('remove', {
    NAME: 'eraser'
  });
}); // buton background changing custom button


$.FroalaEditor.DefineIcon('buttonInfo', {
  NAME: 'info'
});
$.FroalaEditor.RegisterCommand('buttonInfo', {
  title: 'Update Border',
  icon: 'buttonInfo',
  undo: false,
  focus: false,
  callback: function callback() {
    this.customPlugin.popUpUpdateButonClick();
  }
}); // custom dropdown

$.FroalaEditor.DefineIcon('my_dropdown', {
  NAME: 'file-text-o'
});
$.FroalaEditor.RegisterCommand('my_dropdown', {
  title: 'Border radius',
  type: 'dropdown',
  focus: false,
  undo: false,
  refreshAfterCallback: true,
  plugin: 'customPlugin',
  options: {
    'v1': 'Rounded',
    'v2': 'Square',
    'v3': 'Shadowed'
  },
  callback: function callback(cmd, val) {
    var element = this.forms.getInput();
    selectedElement = element;

    if (val === 'v1') {
      var customHTML = "\n          <style>\n            .button-round-input-container {\n              width: 227.86px;\n            }\n\n            .round-header-container {\n              height: 34px;\t\n              width: 227.86px;\t\n              border-radius: 2px 2px 0 0;\n              background-color: #FFFFFF;\t\n              box-shadow: 0 2px 4px 0 rgba(0,0,0,0.5);\n            }\n\n\n            .ro-input-container {\n              display: flex;\n              align-items: center;\n              justify-content: space-between;\n              padding: 10px;\n            }\n\n            .input-number {\n              width: 30px;\n              height: 21px;\n              background: #c8c8c866;\n              border: 0;\n              padding: 2px;\n              font-weight: bold;\n              font-size: 14px;\n              text-align: center;\n            }\n          </style>\n            <div class=\"button-round-input-container\">\n              <div class=\"round-header-container\"><i class=\"fa fa-arrow-left\" style=\"padding: 5px;\"/><span style=\"font-weight: bold; font-size: 12px;\">Style</span></div>\n              <div>\n                <p style=\"font-weight: bold; font-size: 12px; color: #ccc; margin: 12px; margin-bottom: 0\">Rounded</p>\n                <div class=\"ro-input-container\">\n                  <p style=\"font-size: 16px; font-weight: bold; color: #676767\" font-weight: bold;> Radius</p>\n                  <div>\n                    <input type=\"text\" class=\"input-number\" id=\"border-radius-input\"/>\n                    <span style=\"font-size: 12px; font-weight: bold; color: #676767;\">px</span>\n                  </div> \n                </div>\n                <p style=\"font-weight: 600; font-size: 12px; color: rgb(151, 151, 151, 0.7); margin: 12px; margin-top: 5px; text-align: right\" id=\"clear-border-radius-input\">Clear All</p>\n              </div>\n            </div>\n          ";
      this.customPlugin.createPopUpWithCustomHTML(customHTML, 'rounded');
      this.customPlugin.showPopup();
      /* element.style.borderRadius = '10px' */

      ;
    }

    if (val === 'v2') {
      element.style.borderRadius = 0;
    }

    if (val === 'v3') {
      var customPlugin = this.customPlugin;
      var _customHTML = "\n          <div class=\"fr-my-layer fr-layer fr-active\"><div class=\"fr-input-line\"><input id=\"fr-shadow-input\" type=\"text\" placeholder=\"Enter Shadow Value\" tabIndex=\"1\"></div>\n          <button id=\"updateShadow\">update</button>\n          </div>";
      this.customPlugin.createPopUpWithCustomHTML(_customHTML, 'shadow');
      this.customPlugin.showPopup();
    }
  },
  // Callback on refresh.
  refresh: function refresh($btn) {
    console.log('do refresh');
  },
  // Callback on dropdown show.
  refreshOnShow: function refreshOnShow($btn, $dropdown) {
    console.log('do refresh when show');
  }
}); //    $.FroalaEditor.DefineIcon('buttonFill', { NAME: 'star' });
//  $.FroalaEditor.RegisterCommand('buttonBackground', {
//  	  title: 'Button background',
//     focus: true,
//     undo: false,
//     icon: 'buttonFill',
//     refreshAfterCallback: false,
//     callback: function callback() {
//       const element = this.selection.element();
//       const customPlugin = this.customPlugin;
//       const customHTML = `<div class="fr-my-layer fr-layer fr-active" id="fr-my-layer-${this.id}"><div class="fr-input-line"><input id="fr-my-layer-text-${this.id}" type="color" tabIndex="1"></div></div>`
//       this.customPlugin.createPopUpWithCustomHTML(customHTML);
//       this.customPlugin.showPopup();
//     }
//  });
// button resizer 

$.FroalaEditor.DefineIcon('box-shadow', {
  NAME: 'fa fa-magic'
});
$.FroalaEditor.RegisterCommand('boxShadow', {
  title: 'Box Shadow',
  foxus: true,
  undo: true,
  icon: 'box-shadow',
  refreshAfterCallback: true,
  callback: function callback() {
    var customHTML = "\n        <div style=\"padding: 10px;\">\n          <div><label>Enter Box Shdaow</span><input id=\"box-shadow-input\" style=\"width: 50px;font-size: 14px; padding: 10px; border: 2px solid #ccc;\" /></div>\n          <div><label>Enter Box Shdaow Color</span><input id=\"box-shadow-color-input\" style=\"width: 50px;font-size: 14px; padding: 10px; border: 2px solid #ccc;\" /></div>\n        </div>\n      ";
    this.customPlugin.createPopUpWithCustomHTML(customHTML, 'boxShadow');
    this.popups.show('div.edit');
    this.popups.show('customPlugin.popup');
  }
});
$.FroalaEditor.DefineIcon('buttonResize', {
  NAME: 'fa fa-expand'
});
$.FroalaEditor.RegisterCommand('buttonResize', {
  title: 'Button Resize',
  focus: true,
  undo: false,
  icon: 'buttonResize',
  refreshAfterCallback: true,
  callback: function callback() {
    var element = this.forms.getInput();
    var customHTML = "\n      <style>\n        .resize-container {\n          width: 310px;\n          height: 105px;\n          flex: 1;\n          display: flex;\n          flex-direction: column;\n          /* align-items: center; */\n          justify-content: center;\n        }\n\n        .input-container {\n          display: flex;\n          align-items: center;\n          justify-content: space-evenly;\n        }\n\n        .label-container {\n          color: #615e5ee3;\n          font-weight: bold;\n        }\n\n        input[type=\"range\"]{\n          -webkit-appearance: none;\n          -moz-apperance: none;\n          border-radius: 6px;\n          height: 6px;\n          background-image: -webkit-gradient(\n              linear,\n              left top,\n              right top,\n              color-stop(0.15, #14bfaf),\n              color-stop(0.15, #eeeeee)\n          );\n        }\n\n        input[type='range']::-webkit-slider-thumb {\n          -webkit-appearance: none !important;\n          background-color: #ffffff;\n          border: 1px solid #CECECE;\n          height: 15px;\n          width: 15px;\n          border-radius: 15px;\n          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);\n      }\n\n        .close-button {\n          position: absolute;\n          top: 3px;\n          right:5px;\n          margin-bottom: 10px;\n          font-size: 16px;\n          color: #636060;\n          font-weight: bold;\n          cursor: pointer;\n        }\n      </style>\n        <div class=\"resize-container\" id=\"fr-my-layer-".concat(this.id, "\">\n          <div>\n            <span class=\"close-button\" id=\"close-resize-popup\">&times;</span>\n          </div>  \n        <div class=\"fr-input-line input-container\"><span class=\"label-container\">Width</span><input id=\"fr-my-layer-range-text-1\" type=\"range\"  min=0 max=120 step=1 value=10 /><span id=\"fr-editor-button-size-width\" class=\"label-container\"></span> </div>\n      <div class=\"fr-input-line input-container\"><span class=\"label-container\">Height</span><input id=\"fr-my-layer-range-text-2\" type=\"range\" value=\"10\" /><span id=\"fr-editor-button-size-height\" class=\"label-container\"></span></div>\n      </div>");
    this.customPlugin.createPopUpWithCustomHTML(customHTML, 'resize');
    this.customPlugin.showPopup();
  },
  refresh: function refresh($btn) {// $btn.on('click', function() {
    //   $(this).css('background-color', '#cccccc');
    // });
  }
});
$.FroalaEditor.DefineIcon('scaleContainer', {
  NAME: 'fa fa-expand'
});
$.FroalaEditor.RegisterCommand('scaleContainer', {
  title: 'Scale Container',
  focus: true,
  undo: false,
  icon: 'scaleContainer',
  callback: function callback() {
    var customHTML = "\n      <style>\n\n        input[type=\"range\"]{\n          -webkit-appearance: none;\n          -moz-apperance: none;\n          border-radius: 6px;\n          height: 6px;\n          background-image: -webkit-gradient(\n              linear,\n              left top,\n              right top,\n              color-stop(0.15, #14bfaf),\n              color-stop(0.15, #eeeeee)\n          );\n        }\n\n        input[type='range']::-webkit-slider-thumb {\n          -webkit-appearance: none !important;\n          background-color: #ffffff;\n          border: 1px solid #CECECE;\n          height: 15px;\n          width: 15px;\n          border-radius: 15px;\n          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);\n      }\n      </style>\n        <div style=\"padding: 10px;\">\n        <div class=\"fr-input-line input-container\"><span class=\"label-container\">Scale</span><input id=\"fr-scale-container-input\" type=\"range\"  min=10 max=20 step=5 value=1 /><span id=\"fr-editor-container-size\" class=\"label-container\"></span> </div>\n        </div>\n      ";
    this.customPlugin.createPopUpWithCustomHTML(customHTML, 'scaleContainer');
    this.popups.show('div.edit');
    this.popups.show('customPlugin.popup');
  }
});
$.extend($.FE.POPUP_TEMPLATES, {
  'containerColor.picker': '[__BUTTONS__]'
});
$.FroalaEditor.DefineIcon('containerBackground', {
  NAME: 'tint'
});
$.FroalaEditor.RegisterCommand('containerBackground', {
  title: 'Contianer Background',
  focus: true,
  undo: false,
  icon: 'containerBackground',
  callback: function callback() {
    // Get colors according to tab name.
    var colors = this.opts.colorsBackground;
    var colorsHTML = '';
    colors.forEach(function (color, index) {
      colorsHTML += "<div style=\"background-color: ".concat(color, "; height: 30px; width: 30px\" class=\"color-picker-custom\" id=\"").concat(color, "\"></div>");
    });
    var customHTML = "\n     <div>\n        <div style=\"flex: 1; display: flex; width: 210px; jusify-content: flex-start; align-items: flex-start; flex-wrap: wrap;\">\n          ".concat(colorsHTML, "\n        </div>\n        <p style=\"color: #74b8f6; padding-left: 10px; margin: 10px 0px 10px 0px;\">HEX Color</p>\n        <div>\n          <input type=\"text\" style=\"width: 140px;\n          height: 26px;\n          border-radius: 3px;\n          border-color: #f8f8f8;\n          background-color: #f8f8f8;\n          margin: 10px 0px 10px 10px;\n          font-weight: bold;\n          \"\n          id=\"custom-color-input-container\"\n          />\n          <button style=\"\n            width: 35px;\n            height: 26px;\n            border-radius: 3px;\n            border: 1px solid #14bfaf;\n            background-color: #14bfaf;\n            color: #fff;\n            margin: 10px 10px 10px 0px;\"\n          \"\n          id=\"custom-color-select-button\"\n          >OK</button>\n         </div> \n      </div>  \n     ");
    this.customPlugin.createPopUpWithCustomHTML(customHTML, 'containerBackground');
    this.popups.show('div.edit');
    this.popups.show('customPlugin.popup');
  }
}); // $('div#froala-editor').froalaEditor({
// 	useClasses: false,
//   htmlUntouched: true,
// 	toolbarInline: true,
//   toolbarSticky: true,
//   containerToolbar: ['boxShadow', 'scaleContainer', 'containerBackground', 'position', 'backgoundImage'],
//   useClasses: true,
//   buttonToolbarOptions: ['my_dropdown', 'buttonResize', 'color', 'bold', 'italic', 'underline', 'clearFormatting', 'alignLeft', 'alignCenter', 'alignRight', 'alignJustify', 'indent', 'outdent', 'fontFamily', 'fontSize', 'insertLink', 'insertImage'],
//   // Add the custom buttons in the toolbarButtons list, after the separator.
//   toolbarButtons: ['fullscreen', 'undo', 'redo', 'getPDF', 'print', '|', 'bold', 'italic', 'underline', 'color', 'clearFormatting', '|', 'alignLeft', 'alignCenter', 'alignRight', 'alignJustify', '|', 'formatOL', 'formatUL', 'indent', 'outdent', '-', 'paragraphFormat', '|', 'fontFamily', '|', 'fontSize', '|', 'insertLink', 'insertImage', 'quote'],
// })
// })($)
