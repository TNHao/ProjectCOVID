$('.trending-ads-slide').slick({
    dots: false,
    arrows: true,
    nextArrow: '<i class="fa fa-chevron-right arrow-right"></i>',
    prevArrow: '<i class="fa fa-chevron-left arrow-left"></i>',
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    responsive: [{
        breakpoint: 1024,
        settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: true,
            dots: false
        }
    },
    {
        breakpoint: 600,
        settings: {
            slidesToShow: 2,
            slidesToScroll: 1
        }
    },
    {
        breakpoint: 480,
        settings: {
            slidesToShow: 1,
            slidesToScroll: 1
        }
    }]
});

$('.product-slider').slick({
    dots: true,
    arrows: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: false,
    nextArrow: '<i class="fa fa-chevron-right arrow-right"></i>',
    prevArrow: '<i class="fa fa-chevron-left arrow-left"></i>',
    customPaging: function (slider, i) {
        var image = $(slider.$slides[i]).data('image');
        return '<img class="img-fluid" src="' + image + '" alt="product-img">';
    }
});