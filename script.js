function play(file) {
		var audio = new Audio('sounds/' + file + '.wav');
		audio.play();
	};
	function randint(max, exclude) {
		while (true) {
			var rand = 0.5 + Math.random() * (max - 2)
			rand = Math.round(rand);
			if (!exclude.includes(rand)) return rand;
		};
	};
	function shuffle(arr){
		var j, temp;
		for(var i = arr.length - 1; i > 0; i--){
			j = Math.floor(Math.random()*(i + 1));
			temp = arr[j];
			arr[j] = arr[i];
			arr[i] = temp;
		}
		return arr;
	};
	function check_result(p,b) {
		if (p > b) {
			play('win');
		} else if (p < b) {
			play('botwin');
		}
	};
	//$(document).ready(function(e) {$('.man').click(function(e) {play('click')})})
	$(document).ready(function(e) {
		//var items = [8, 13, 1, 11, 9, 4, 5, 12, 6, 7, 6, 3, 12, 11, 7, 2, 14, 15, 9, 15, 8, 1, 10, 2, 13, 3, 5, 4, 14, 10];
		const citems = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15];
		var items = shuffle(citems);
		var opened = [];
		//var temp_opened = [];
		var locked = false;
		var score = 0;
		var bot_score = 0;
		var clicked = [0, 0]; // [номер предмета, номер ячейки]
		for (let i = 0; i < 30; i++) {
			$('.main').append('<div class="img img-' + (i+1).toString() + '"><img src="images/B_' + items[i].toString() + '.BMP" style="display: none" data-item="' + items[i].toString() + '"></div>')
		}
		$('.img').click(function(e) {
			if (!locked) $(this).children('img').css('display', 'inherit');
			var cell = Math.abs(+(($(this).attr('class')+' ').slice(-3, -1)));
			var item = $(this).children('img').data('item');
			// если заблокировано/открыто/клик по нажатой ячейке
			if (locked || opened.includes(cell) || clicked[0] == item && clicked[1] == cell) {
				v = 0;
			// если никуда не кликнуто
			} else if (clicked[0] == 0 && clicked[1] == 0) {
				clicked = [+item, +cell];
				//temp_opened.push();
				play('click');
			// иначе
			} else {
				// если выбрано два правильных предмета
				if (clicked[0] == item && clicked[1] != cell) {
					opened.push(+clicked[1]);
					opened.push(+cell);
					score++;
					$('.score').html(score);
					clicked = [0, 0];
					if (opened.length >= 30) {
							check_result(score, bot_score);
						} else {
							play('right');
						}
				// если игрок не угадал
				} else {
					locked = true;
					play('click');
					setTimeout(function() {
						// закрыть ячейки, открытые игроком
						$('.img-' + cell).children('img').css('display', 'none');
						$('.img-' + clicked[1]).children('img').css('display', 'none');
						var randcell1 = randint(30, opened);
						var randcell2 = randint(30, opened.concat(randcell1));
						var randitem1 = $('.img-' + randcell1.toString()).children('img').data('item');
						var randitem2 = $('.img-' + randcell2.toString()).children('img').data('item');
						$('.img-' + randcell1.toString()).children('img').css('display', 'inherit');
						$('.img-' + randcell2.toString()).children('img').css('display', 'inherit');
						// если робот угадал
						if (randitem1 == randitem2) {
							opened.push(randcell1);
							opened.push(randcell2);
							bot_score++;
							$('.bot-score').html(bot_score);
							clicked = [0, 0];
							locked = false;
							if (opened.length >= 30) {
								check_result(score, bot_score);
							} else {
								play('botright');
							}
						// если никто не угадал
						} else {
							play('click');
							setTimeout(function() {
								// закрыть все ячейки
								$('.img-' + randcell1).children('img').css('display', 'none');
								$('.img-' + randcell2).children('img').css('display', 'none');
								clicked = [0, 0];
								locked = false;
							}, 1000);
						}
					}, 1000);
				}
			}
		})
	});
