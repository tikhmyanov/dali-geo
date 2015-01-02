////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// jQuery
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function($) {
    "use strict";

    equalHeight('.equal-height');

    $('.nav > li > ul li > ul').css('left', $('.nav > li > ul').width());

    var navigationLi = $('.nav > li');
    navigationLi.hover(function() {
        if ($('body').hasClass('navigation-fixed-bottom')){
            if ($(window).width() > 768) {
                var spaceUnderNavigation = $(window).height() - ($(this).offset().top - $(window).scrollTop());
                if(spaceUnderNavigation < $(this).children('.child-navigation').height()){
                    $(this).children('.child-navigation').addClass('position-bottom');
                    console.log('smaller');
                } else {
                    $(this).children('.child-navigation').removeClass('position-bottom');
                    console.log('bigger');
                }
            }
        }
    });

    setNavigationPosition();

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

    centerSearchBox();

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// On RESIZE
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
$(window).on('resize', function(){
    setNavigationPosition();
    setCarouselWidth();
    equalHeight('.equal-height');
    centerSlider();
});
*/

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// On LOAD
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(window).load(function(){

//  Show Search Box on Map

    $('.search-box.map').addClass('show-search-box');

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

function setNavigationPosition(){
    $('.nav > li').each(function () {
        if($(this).hasClass('has-child')){
            var fullNavigationWidth = $(this).children('.child-navigation').width() + $(this).children('.child-navigation').children('li').children('.child-navigation').width();
            if(($(this).children('.child-navigation').offset().left + fullNavigationWidth) > $(window).width()){
                $(this).children('.child-navigation').addClass('navigation-to-left');
            }
        }
    });
}

function initCounter(){
    $('.number').countTo({
        speed: 3000,
        refreshInterval: 50
    });
}

function showAllButton(){
    var rowsToShow = 2; // number of collapsed rows to show
    var $layoutExpandable = $('.layout-expandable');
    var layoutHeightOriginal = $layoutExpandable.height();
    $layoutExpandable.height($('.layout-expandable .row').height()*rowsToShow-5);
    $('.show-all').on("click", function() {
        if ($layoutExpandable.hasClass('layout-expanded')) {
            $layoutExpandable.height($('.layout-expandable .row').height()*rowsToShow-5);
            $layoutExpandable.removeClass('layout-expanded');
            $('.show-all').removeClass('layout-expanded');
        } else {
            $layoutExpandable.height(layoutHeightOriginal);
            $layoutExpandable.addClass('layout-expanded');
            $('.show-all').addClass('layout-expanded');
        }
    });

}

//  Center Search box Vertically

function centerSearchBox() {
}

//  Equal heights

function equalHeight(container){

    var currentTallest = 0,
        currentRowStart = 0,
        rowDivs = new Array(),
        $el,
        topPosition = 0;
    $(container).each(function() {

        $el = $(this);
        $($el).height('auto');
        topPostion = $el.position().top;

        if (currentRowStart != topPostion) {
            for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
                rowDivs[currentDiv].height(currentTallest);
            }
            rowDivs.length = 0; // empty the array
            currentRowStart = topPostion;
            currentTallest = $el.height();
            rowDivs.push($el);
        } else {
            rowDivs.push($el);
            currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
        }
        for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
            rowDivs[currentDiv].height(currentTallest);
        }
    });
}