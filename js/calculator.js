let calculator = new (function () {
  this.$beadlockInput = null;

  this.init = function () {
    calculator.$beadlockInput = $('input[data-name=Beadlock]');

    calculator.toggleBeadlockDisabled();
  };

  this.toggleBeadlockDisabled = function () {
    let enabled = calculator._isBeadlockEnabled();

    if (!enabled) {
      calculator.$beadlockInput.removeAttr('checked');
      calculator.$beadlockInput.attr('disabled', true).closest('label').addClass('disabled');
    } else {
      calculator.$beadlockInput.removeAttr('disabled').closest('label').removeClass('disabled');
    }

    calculator.$beadlockInput.trigger('refresh');
  };

  this._isBeadlockEnabled = function () {
    if ($('input[name=type]:checked').val() !== 'suv') {
      return false;
    }

    let diameter = $('input[name=diameter]:checked').val();

    if (diameter !== '17' && diameter !== '18' && diameter !== '20') {
      return false;
    }

    return true;
  };
})();

$(document).ready(function () {
  if ($('.calculator__body').length > 0) calcStart();
  half();

  calculator.init();

  function getCurrentUrlParam() {
    window.location.search
      .replace('?', '')
      .split('&')
      .reduce(function (p, e) {
        var paramArr = e.split('=');
        var paramName = decodeURIComponent(paramArr[0]);
        var paramVal = decodeURIComponent(paramArr[1]);
        console.log(paramName, paramVal, 'lol');
      }, {});
  }
});

function calcStart() {
  /*Wheels params*/
  var wheelsParamObj = {
    mono: {
      16: { min_j: 6, max_j: 12, price: 48750 },
      17: { min_j: 7.5, max_j: 12, price: 48750 },
      18: { min_j: 7.5, max_j: 12, price: 51250 },
      19: { min_j: 8, max_j: 12, price: 53750 },
      20: { min_j: 8, max_j: 14, price: 57500 },
      21: { min_j: 8, max_j: 13, price: 62500 },
      22: { min_j: 8, max_j: 12, price: 66250 },
      23: { min_j: 10, max_j: 13, price: 75000 },
      24: { min_j: 10, max_j: 12, price: 80000 },
    },
    two: {
      16: { min_j: 7.5, max_j: 12, price: 72500 },
      17: { min_j: 7.5, max_j: 12, price: 72500 },
      18: { min_j: 7.5, max_j: 12, price: 76250 },
      19: { min_j: 8, max_j: 12, price: 80000 },
      20: { min_j: 8, max_j: 14, price: 85000 },
      21: { min_j: 8, max_j: 12, price: 88750 },
      22: { min_j: 10, max_j: 12, price: 91250 },
      23: { min_j: 10, max_j: 12, price: 101250 },
      24: { min_j: 10, max_j: 14, price: 107500 },
    },
    suv: {
      16: { min_j: 7.5, max_j: 12, price: 56250 },
      17: { min_j: 7.5, max_j: 11, price: 56250 },
      18: { min_j: 7.5, max_j: 11, price: 58750 },
      19: { min_j: 8, max_j: 12, price: 61250 },
      20: { min_j: 8, max_j: 12.5, price: 65000 },
      21: { min_j: 8, max_j: 12.5, price: 70000 },
      22: { min_j: 8, max_j: 12.5, price: 73750 },
      23: { min_j: 10, max_j: 12, price: 82500 },
      24: { min_j: 9, max_j: 12, price: 87500 },
    },
  };

  /*Wheels optionss*/
  var addOptionObj = {
    polish: 8750,
    carbonic: 6250,
    chromium: 6250,
  };

  var rangeSlider = document.getElementById('range');

  buildRadiusBlock(wheelsParamObj, false);
  $(document).on('change', '.calculator__label.wheelsType', function (e) {
    buildRadiusBlock(wheelsParamObj, rangeSlider);
    calculator.toggleBeadlockDisabled();
    half();
  });

  buildRangeJBlock(wheelsParamObj, rangeSlider);
  $(document).on('change', '.calculator__label.wheelsRadius', function (e) {
    updateRangeJBlock(wheelsParamObj, rangeSlider);
    calculator.toggleBeadlockDisabled();
    half();
  });

  $(document).on('change', '.calculator__label input', function (e) {
    $('.calculator__bottom').slideUp(400);
  });

  var urlQueryPart = location.href.split('?')[1];
  if (urlQueryPart && urlQueryPart.search('color=') == -1) {
    wheelsCalc(wheelsParamObj, addOptionObj);
    showCalcForm();
  }

  $('.calculator__submit input[type="submit"]').click(function (e) {
    e.preventDefault();
    calculator.toggleBeadlockDisabled();
    addCalcParamToUrl();
    wheelsCalc(wheelsParamObj, addOptionObj);
    showCalcForm();
  });
}

function showCalcForm() {
  $('.calculator__bottom').slideDown(400);
  setTimeout(function () {
    $('.calculator__form').addClass('open');
  }, 1500);
}

function buildRadiusBlock(wheelsParamObj, rangeSlider) {
  var radiusHtmlBlock = '';
  var wheelsType = $('.wheelsType input:checked').val();
  var typeObj = wheelsParamObj[wheelsType];
  var filterRadiusVal = parseInt($('.wheelsRadius').attr('data-val'));
  var issetFilter = false;

  for (radius in typeObj) {
    var checked = '';
    if (filterRadiusVal == radius) {
      checked = 'checked="checked"';
      issetFilter = true;
    }
    radiusHtmlBlock +=
      '<label><input type="radio" name="diameter" value="' +
      radius +
      '" ' +
      checked +
      ' /> ' +
      radius +
      "'</label>";
  }

  $('.calculator__label.wheelsRadius').html(radiusHtmlBlock);
  if (!issetFilter) $('.calculator__label.wheelsRadius input').eq(0).attr('checked', 'checked');
  $('.calculator__label.wheelsRadius input').styler();

  //   if (rangeSlider) updateRangeJBlock(wheelsParamObj, rangeSlider);
}

function buildRangeJBlock(wheelsParamObj, rangeSlider) {
  var wheelsType = $('.wheelsType input:checked').val();
  var wheelsRadius = $('.wheelsRadius input:checked').val();
  var radiusObj = wheelsParamObj[wheelsType][wheelsRadius];
  var min_j = radiusObj['min_j'];
  var max_j = radiusObj['max_j'];

  var currentRangeVal = min_j;
  var filterRangeVal = parseFloat($('#range').attr('data-val'));
  if (filterRangeVal > +min_j && filterRangeVal <= max_j) currentRangeVal = filterRangeVal;

  //   noUiSlider.create(rangeSlider, {
  //     start: [currentRangeVal],
  //     step: 0.5,
  //     range: {
  //       min: [min_j],
  //       max: [max_j],
  //     },
  //     ariaFormat: wNumb({
  //       decimals: 1,
  //     }),
  //     format: wNumb({
  //       decimals: 1,
  //       suffix: 'J',
  //     }),
  //     pips: {
  //       mode: 'steps',
  //       density: 20,
  //       format: wNumb({
  //         decimals: 1,
  //       }),
  //     },
  //   });

  //   var rangeSliderValueElement = document.getElementById('range__value');
  //   rangeSlider.noUiSlider.on('update', function (values, handle) {
  //     rangeSliderValueElement.innerHTML = values[handle];
  //     $('.calculator__bottom').slideUp(400);
  //     $('.calculator__form').removeClass('open');
  //   });
}

function updateRangeJBlock(wheelsParamObj, rangeSlider) {
  var wheelsType = $('.wheelsType input:checked').val();
  var wheelsRadius = $('.wheelsRadius input:checked').val();
  var radiusObj = wheelsParamObj[wheelsType][wheelsRadius];
  var min_j = radiusObj['min_j'];
  var max_j = radiusObj['max_j'];

  //   rangeSlider.noUiSlider.updateOptions({
  //     start: [min_j],
  //     range: {
  //       min: min_j,
  //       max: max_j,
  //     },
  //   });
}

function wheelsCalc(wheelsParamObj, addOptionObj) {
  var wheelsType = $('.wheelsType input:checked').val();
  var wheelsRadius = $('.wheelsRadius input:checked').val();
  var radiusObj = wheelsParamObj[wheelsType][wheelsRadius];
  if (radiusObj) {
    var addOptionPrice = 0;
    var optionList = '';
    var min_j = radiusObj['min_j'];
    //var max_j = radiusObj['max_j'];
    var min_price = radiusObj['price'];
    var current_j = parseFloat($('#range__value').html());
    $('.wheelsOption input:checked').each(function () {
      var addOptionVal = $(this).val();
      addOptionPrice += addOptionObj[addOptionVal];
      optionList += $(this).attr('data-name') + '</br>';
    });

    var wheelsTypeText = 'Односоставные';
    if (wheelsType === 'two') wheelsTypeText = 'Двухсоставные';
    else if (wheelsType === 'suv') wheelsTypeText = 'Off-road';
    else if (wheelsType === 'carbon') wheelsTypeText = 'CARBON+';
    else if (wheelsType === 'magnesium') wheelsTypeText = 'MAGNESIUM';
    var paramList = wheelsTypeText + ', Диаметр: ' + wheelsRadius;

    var priceForJ = 0;
    var totalPriceForOneWheel = min_price + priceForJ + addOptionPrice;
    var totalPrice = totalPriceForOneWheel * 4;

    console.log(priceForJ);
    console.log(totalPriceForOneWheel);
    console.log(totalPrice);

    $('#addOptionRes').html(optionList);
    $('#paramRes').html(paramList);
    $('.calculator-results__price span').html(totalPriceForOneWheel.toLocaleString());
    $('.calculator-results__total span').html(totalPrice.toLocaleString());
  } else alert('Что то пошло не так. Обратитесь к администратору.');
}

function addCalcParamToUrl() {
  var clearUrl = location.href.split('?')[0];
  var paramString = '?';

  var rangeParam = parseFloat($('#range__value').html());

  $('.calculator__label input:checked').each(function () {
    paramString += $(this).attr('name') + '=' + $(this).val() + '&';
  });

  paramString += 'range=' + rangeParam;
  //   history.pushState({}, null, clearUrl + paramString);
}

function half() {
  $('.noUi-value[data-value*=".5"]').prev('.noUi-marker').addClass('half');
}
