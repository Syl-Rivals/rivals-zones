var rivals = rivals || {};rivals.utils = rivals.utils || {};
rivals.jsonTimes = [
	{ Name: '[R]NetanelG', Timezone: 3 },
	{ Name: '[R]Bernado', Timezone: 0 },
	{ Name: '[R[Vitold', Timezone: 11 },
	{ Name: '[R] Syl', Timezone: -3 },
	{ Name: '[R] Shanks', Timezone: -1 },
	{ Name: '[R]NastyCloud', Timezone: 1 },
	{ Name: '[R]Hollie', Timezone: 1 },
	{ Name: '[R]Spartan117', Timezone: -7 },
	{ Name: '[R] QB300', Timezone: 9.5 },
	{ Name: '[R]Jan :)', Timezone: 0 },
	{ Name: '~ca~[R]~is~', Timezone: -11 },
	{ Name: '[R]johns', Timezone: 1 },
	{ Name: 'Alex*', Timezone: 6.5 },
	//{ Name: '[R] Avelane', Timezone: 1 }, INACTIVE
	{ Name: 'Ve[R]l', Timezone: 7 },
	{ Name: '[R] neXus', Timezone: 6 },
	{ Name: '[R]Cool', Timezone: 2 },
	{ Name: '[R] BasedGod', Timezone: -5 },
	{ Name: 'gato pirata', Timezone: 4 },
	{ Name: 'Sense[R]', Timezone: 0 },
	{ Name: 'Maximum', Timezone: 9 },
	{ Name: '[R] Seven', Timezone: -11 },
	{ Name: '[R] Excelsior', Timezone: +1 },
	{ Name: '[R]yudee', Timezone: 8 },
	{ Name: 'Phu Thieu Gia', Timezone: -10 },
	{ Name: 'KniveS', Timezone: -5 },
	{ Name: '[R] Zylo', Timezone: -4 },
	{ Name: '[R] Nukinfutz', Timezone: 10 },
	{ Name: '[R]aven', Timezone: 7 },
	{ Name: '[R] El Greco', Timezone: 5 },
	{ Name: '[R] Elaynode', Timezone: 3 },
	{ Name: '[R] Andy', Timezone: 8 },
	{ Name: '[R]Chip', Timezone: 9.5 },
	{ Name: 'FisHunte[R]Ⓡ', Timezone: 3 },
	{ Name: '[R] AⓇmin', Timezone: 4.5 },
	{ Name: 'Vancouver', Timezone: 6 },
	{ Name: 'DJ1337', Timezone: 1 },
	{ Name: '颶風', Timezone: +4.5 },
	{ Name: 'Guru', Timezone: +3 },
	{ Name: 'Champagne', Timezone: -3 },
	{ Name: 'Special', Timezone: -5 },
	{ Name: '[R]GR!NGO', Timezone: 10 },
	{ Name: '[R]Deadline', Timezone: 2 },
	{ Name: '[R]TomTom', Timezone: 12 },
	{ Name: '[R] Asat', Timezone: 4 },
	{ Name: '[R]ora', Timezone: 12 },
	{ Name: '[R] Vader', Timezone: 1 },
	{ Name: '[R]JAXX', Timezone: -10 },
	{ Name: '[R]otten', Timezone: 1 }
	//{ Name: '[R]valter', Timezone: ? }, UNKNOWN TIMEZONE
];

// Basic timezones
rivals.timeZones = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1];
rivals.halfTimeZones = [5.5, 9.5];
rivals.rewardTime =  {hour: 21, minute: 5};
rivals.systemPassword = "ec4dcd22d050931ab78b43ae3dbef490a0ad614a";
rivals.debug = false;

$(function() {
  rivals.displayTimeline();
  
  $('#toggleView').on('click', function() {
    rivals.displayTimeZones();
  });
});

rivals.setRewards = function ($div, lowerOffset, upperOffset) {
  var heroes = [];
  
  var singleLog = true;     
  $(rivals.jsonTimes).each(function(i, v) {
    if(typeof v.Timezone !== 'undefined' && v.Timezone !== null) {
      var currentLocalTime = moment.utc().add({hours: v.Timezone});
      
      var r = $.extend({}, rivals.rewardTime, {day: currentLocalTime.date()});
      var targetUpper = moment.utc(r).add(upperOffset);
      var targetLower = moment.utc(r).add(lowerOffset);
                      
      var log = '';
      log += '[' + v.Timezone + '] ' + currentLocalTime.format('MM-DD H:mm-Z'); 
      log += ' => (' + targetLower.format('MM-DD H:mm-Z') + ') & (' + targetUpper.format('MM-DD H:mm-Z') + ') [' + currentLocalTime.isBetween(targetLower, targetUpper) + ']';  
      rivals.log(log);
        
      if(currentLocalTime.isBetween(targetLower, targetUpper)) {
        heroes.push(v);
      }
    }    
  });
  
  var $p = $div.find('p');   
	$p.html('');
	
	rivals.loadHeroes($p, heroes);
  	
  
  if ($p.html() == '') {
		$p.html('No one has a reward at this time');
	}
	else {
		var $span = $p.find('span:last'), text = $span.html();
		$span.html(text.substring(0, text.length - 2))
	}
};

rivals.loadHeroes = function($container, heroes) {
  $(heroes).each(function(i, hero) {
    $('<span>' + hero.Name + ', </span>').appendTo($container);
  });
};

rivals.loadTimeZones = function () {
	var minZone = -11, maxZone = 12;

	for (var i = minZone; i <= maxZone; i++) {
		$('#timezone').append($('<option>', { value: i, text: 'GMT' + (i != 0 ? (i > 0 ? "+" + i : i) : '') }));
	}
};

rivals.calculateCurrentRewardTimezone = function(lagCurrentReward) {
	var utcTime = moment().utc();
	utcTime = lagCurrentReward === true ? utcTime.subtract({minutes: 5}) : utcTime;
	var utcHour = parseInt(utcTime.format('H'));
	
	return rivals.timeZones[((rivals.rewardHour - utcHour) + 24) % 24];
};

rivals.shiftTimezone = function (timeZone, offset) {
	var tz = timeZone + offset;
	return rivals.timeZones[(tz + 24) % 24];
};

rivals.displayTimeline = function() {
  var $timeline = $('#cd-timeline'), $timezones = $('#all-times > div');
  
  // Local time 21:05-22:05
 	rivals.setRewards($('#reward-passed'), {hour: 0, minute: 0}, {hour: 1, minute: 0});
 	// Local time 20:05-21:05
	rivals.setRewards($('#reward-now'), {hour: -1, minute: 0}, {});
	// Local time 18:05-20:05
	rivals.setRewards($('#reward-soon'), {hour: -3, minute: -5}, {hour: -1, minute: 0});

  $timeline.show();
  $timezones.hide();
  
  $('#toggleView').text('(View All Timezones)').off('click').on('click', function() {
    rivals.displayTimeZones();
  });
}

rivals.displayTimeZones = function() {
  var $timeline = $('#cd-timeline'), $timezones = $('#all-times > div');
  
  $timeline.hide();
  $timezones.show();
  
  rivals.loadTimeZones($timezones);
  
  $('#toggleView').text('(View Upcoming Rewards)').off('click').on('click', function() {
    rivals.displayTimeline();
  });
}


rivals.loadTimeZones = function($container) {
  $container.html('');
  
  var p = 'Timezone', times = rivals.jsonTimes.sort(function(a, b) {
    if(a[p] == null) { return 1; }
    if(b[p] == null) { return 0; }
     
    return (a[p] > b[p]) ? 1 : ((a[p] < b[p]) ? -1 : 0);
  });
  
  $(times).each(function(i,v) {
    $('<div>Timezone ' + v.Timezone + ' : ' + v.Name + '</div>').appendTo($container);
  });
}

rivals.log = function (message) {
	if (typeof console !== 'undefined' && console && console.log && rivals.debug === true) {
		console.log(message);
	} else {
		rivals.utils.logs = rivals.utils.logs || [];
		rivals.utils.logs.push(message);
	}
};
