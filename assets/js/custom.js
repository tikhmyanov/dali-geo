////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// jQuery
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function($) {
    "use strict";

    $('#form-map-sale .input-group.date').datepicker({
        format: "yyyy-mm-dd",
        todayBtn: "linked",
        language: "ru",
        todayHighlight: true,
        autoclose: true
    });

    var select = $('select');
    if (select.length > 0 ){
        select.selectpicker();
    }

    var bootstrapSelect = $('.bootstrap-select');
    var dropDownMenu = $('.dropdown-menu');

    bootstrapSelect.on('shown.bs.dropdown', function () {
        dropDownMenu.removeClass('animation-fade-out');
        dropDownMenu.addClass('animation-fade-in');
    });

    bootstrapSelect.on('hide.bs.dropdown', function () {
        dropDownMenu.removeClass('animation-fade-in');
        dropDownMenu.addClass('animation-fade-out');
    });

    bootstrapSelect.on('hidden.bs.dropdown', function () {
        var _this = $(this);
        $(_this).addClass('open');
        setTimeout(function() {
            $(_this).removeClass('open');
        }, 100);
    });

    select.change(function() {
        if ($(this).val() != '') {
            $('.form-search .bootstrap-select.open').addClass('selected-option-check');
        }else {
            $('.form-search  .bootstrap-select.open').removeClass('selected-option-check');
        }
    });

    $('#form-map-sale').submit(function(e) {
        e.preventDefault();
        getLocations(); 
    });

});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// On LOAD
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(window).load(function(){

//  Show Search Box on Map

    $('.search-box.map').addClass('show-search-box');

    $('#form-map-sale .input-group.date').datepicker('update', 'today');

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setMapHeight(){
    var $body = $('body');
    if($body.hasClass('has-fullscreen-map')) {
        $('#map').height($(window).height() - $('.navigation').height());
    }
    if($body.hasClass('has-fullscreen-map')) {
        $(window).on('resize', function(){
            $('#map').height($(window).height() - $('.navigation').height());
            var mapHeight = $('#map').height();
            var contentHeight = $('.search-box').height();
            var top;
            top = (mapHeight / 2) - (contentHeight / 2);
//            $('.search-box-wrapper').css('top', top);
        });
    }
    if ($(window).width() < 768) {
        $('#map').height($(window).height() - $('.navigation').height());
    }
}

function getLocations() {
    $.ajax({
      type: 'get',
      dataType: 'json',
      url: 'ajax.php',
      data: {
        date : $('input[name="form-date"]').val(),
        agent : $('select[name="form-agent"]').val()
      },
      success: function (json) {
        $('#order-list').show('fast');
        setMarkers(json['orders']);
      }
    });
}