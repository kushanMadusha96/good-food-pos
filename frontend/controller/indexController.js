$(document).ready(function () {
    $("#nav-ul").click(function () {
        $('#search-input').val('');
    });
    $(":input").attr('autocomplete', 'off');
});

//preloader
window.onload = async () => {
    $("#preloader").css("display", "none");
}

// nav bar
$("#customer").css("display", "none");
$("#item").css("display", "none");
$("#po").css("display", "none");
$("#od").css("display", "none");

$("#dropdown").css("display", "none");
$("#home-nav").css("font-weight", "bold");
$("#search-input").css("display", "none");
$("#label-btn-search ").css("display", "none");

$("#home-nav").on('click', () => {
    $("#customer").css("display", "none");
    $("#item").css("display", "none");
    $("#po").css("display", "none");
    $("#od").css("display", "none");
    $("#home").css("display", "block");

    $("#dropdown").css("display", "none");
    $("#label-btn-search ").css("display", "none");
    $("#search-input").css("display", "none");


    $("#home-nav").css("font-weight", "bold");
    $("#customer-nav").css("font-weight", "normal");
    $("#item-nav").css("font-weight", "normal");
    $("#po-nav").css("font-weight", "normal");
    $("#od-nav").css("font-weight", "normal");
});

$("#customer-nav").on('click', () => {
    $("#home").css("display", "none");
    $("#item").css("display", "none");
    $("#od").css("display", "none");
    $("#po").css("display", "none");
    $("#customer").css("display", "block");

    $("#dropdown").css("display", "none");
    $("#label-btn-search ").css("display", "block");
    $("#search-input").css("display", "block");
    $("#search-input").attr("placeholder", " Enter id or name");

    $("#home-nav").css("font-weight", "normal");
    $("#customer-nav").css("font-weight", "bold");
    $("#item-nav").css("font-weight", "normal");
    $("#po-nav").css("font-weight", "normal");
    $("#od-nav").css("font-weight", "normal");
});

$("#item-nav").on('click', () => {
    $("#home").css("display", "none");
    $("#customer").css("display", "none");
    $("#od").css("display", "none");
    $("#po").css("display", "none");
    $("#item").css("display", "block");

    $("#dropdown").css("display", "none");
    $("#label-btn-search ").css("display", "block");
    $("#search-input").css("display", "block");
    $("#search-input").attr("placeholder", " Enter id or name");

    $("#home-nav").css("font-weight", "normal");
    $("#customer-nav").css("font-weight", "normal");
    $("#item-nav").css("font-weight", "bold");
    $("#po-nav").css("font-weight", "normal");
    $("#od-nav").css("font-weight", "normal");
});

$("#od-nav").on('click', () => {
    $("#home").css("display", "none");
    $("#customer").css("display", "none");
    $("#item").css("display", "none");
    $("#po").css("display", "none");
    $("#od").css("display", "block");

    $("#dropdown").css("display", "none");
    $("#label-btn-search ").css("display", "block");
    $("#search-input").css("display", "block");
    $("#search-input").attr("placeholder", " Enter any id or date");

    $("#home-nav").css("font-weight", "normal");
    $("#customer-nav").css("font-weight", "normal");
    $("#item-nav").css("font-weight", "normal");
    $("#po-nav").css("font-weight", "normal");
    $("#od-nav").css("font-weight", "bold");
});

$("#po-nav").on('click', () => {
    $("#home").css("display", "none");
    $("#customer").css("display", "none");
    $("#od").css("display", "none");
    $("#item").css("display", "none");
    $("#po").css("display", "block");

    $("#dropdown").css("display", "block");
    $("#label-btn-search ").css("display", "none");
    $("#search-input").css("display", "block");
    $("#search-input").attr("placeholder", " Search");


    $("#home-nav").css("font-weight", "normal");
    $("#customer-nav").css("font-weight", "normal");
    $("#item-nav").css("font-weight", "normal");
    $("#po-nav").css("font-weight", "bold");
    $("#od-nav").css("font-weight", "normal");
})