//棋盘显示
var board = [];
//得分
var score = 0;
//是否已经发生过碰撞
var hasConficted = [];
//滑动起始横坐标
var startx = 0;
//滑动起始纵坐标
var starty = 0;
//滑动结束横坐标
var endx = 0;
//滑动结束纵坐标
var endy = 0;

$(document).ready(function() {
	prepareForMobile();
	newgame();
})

//移动端显示
function prepareForMobile() {
	if(documentWidth > 500) {
		gridContainerWidth = 500;
		cellSpace = 20;
		cellSideLength = 100;
	}
	$("#grid-container").css("width", gridContainerWidth - 2 * cellSpace);
	$("#grid-container").css("height", gridContainerWidth - 2 * cellSpace);
	$("#grid-container").css("padding", cellSpace);
	$("#grid-container").css("border-radius", 0.02 * gridContainerWidth);

	$(".grid-cell").css("width", cellSideLength);
	$(".grid-cell").css("height", cellSideLength);
	$(".grid-cell").css("border-radius", 0.02 * cellSideLength);
}

/**
 * 开始新的游戏
 */
function newgame() {
	//初始化棋盘格
	init();
	//在随机两个格子生成数字
	generateOneNumber();
	generateOneNumber();
}

/**
 * 初始化棋盘
 */
function init() {
	for(var i = 0; i < 4; i++) {
		for(var j = 0; j < 4; j++) {
			var gridCell = $("#grid-cell-" + i + "-" + j);
			gridCell.css('top', getPosTop(i, j));
			gridCell.css('left', getPosLeft(i, j));
		}
	}

	for(var i = 0; i < 4; i++) {
		board[i] = [];
		hasConficted[i] = [];
		for(var j = 0; j < 4; j++) {
			board[i][j] = 0;
			hasConficted[i][j] = false;
		}
	}

	updateBoardView();
	score = 0;
}

function updateBoardView() {
	$(".number-cell").remove();
	for(var i = 0; i < 4; i++) {
		for(var j = 0; j < 4; j++) {
			//"<div class="number-cell" id="number-cell-'+i+'-'+j +'"></div>'

			$("#grid-container").append("<div class='number-cell' id='number-cell-" + i + "-" + j + "'" + "></div>");
			var theNumberCell = $('#number-cell-' + i + '-' + j);
			if(board[i][j] == 0) {
				theNumberCell.css('width', 0);
				theNumberCell.css('height', 0);
				theNumberCell.css('top', getPosTop(i, j) + cellSideLength / 2);
				theNumberCell.css('left', getPosLeft(i, j) + cellSideLength / 2);
			} else {
				theNumberCell.css('width', cellSideLength);
				theNumberCell.css('height', cellSideLength);
				theNumberCell.css('top', getPosTop(i, j));
				theNumberCell.css('left', getPosLeft(i, j));
				theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
				theNumberCell.css('color', getNumberColor(board[i][j]));
				theNumberCell.text(board[i][j]);
			}
			hasConficted[i][j] = false;
		}
	}
	$('.number-cell').css('line-height', cellSideLength + 'px');
	$('.number-cell').css('font-size', 0.6 * cellSideLength + 'px');
}

function generateOneNumber() {
	if(nospace(board)) {
		return false;
	}
	//随机生成一个位置
	var randx = parseInt(Math.floor(Math.random() * 4));
	var randy = parseInt(Math.floor(Math.random() * 4));

	var times = 0;
	//循环50次查找出空格子生成一个随机数
	while(times < 50) {
		if(board[randx][randy] == 0) {
			break;
		}
		randx = parseInt(Math.floor(Math.random() * 4));
		randy = parseInt(Math.floor(Math.random() * 4));

		times++;
	}
	//如果50次还没有生成随机数则自己遍历二位数组找出空格子
	if(times == 50) {
		for(var i = 0; i < 4; i++) {
			for(var j = 0; j < 4; j++) {
				if(board[i][j] == 0) {
					randx = i;
					randy = j;
				}
			}
		}
	}

	//随机生成数字（游戏开始时随机生成的数字为2或者4）
	var randNumber = Math.random() < 0.5 ? 2 : 4;

	//在随机位置显示随机数字
	board[randx][randy] = randNumber;
	console.log(board);
	showNumberWithAnimation(randx, randy, randNumber);

	return true;
}

/**
 * 玩家响应事件
 */
$(document).keydown(function(event) {
	event.preventDefault();
	switch(event.keyCode) {
		//向左left
		case 37:
			if(moveLeft()) {
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}
			break;
			//向上up
		case 38:
			if(moveUp()) {
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}
			break;
			//向右right
		case 39:
			if(moveRight()) {
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}
			break;
			//向下down
		case 40:
			if(moveDown()) {
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}
			break;
		default:
			break;
	}
});

/**
 * 触摸开始事件监听器，设置起始横纵坐标
 */
document.addEventListener('touchstart', function(event) {
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
});

/**
 * 避免bug
 */
document.addEventListener('touchmove', function(event) {
	event.preventDefault();
});

/**
 * 触摸开始事件监听器，设置结束横纵坐标
 */
document.addEventListener('touchend', function() {
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;
	var deltax = endx - startx;
	var deltay = endy - starty;

	if(Math.abs(deltax) < 0.3 * documentWidth && Math.abs(deltay) < 0.3 * documentWidth) {
		return;
	}

	//x移动距离大于y方向则说明是左右移动
	if(Math.abs(deltax) > Math.abs(deltay)) {

		if(deltax > 0) {
			//大于0则说明是向右
			if(moveRight()) {
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}
		} else {
			//小于0则说明是向左
			if(moveLeft()) {
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}
		}
	} else {

		if(deltay > 0) {
			//大于0则说明向下移动
			if(moveDown()) {
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}
		} else {
			//小于0则说明向上移动
			if(moveUp()) {
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}
		}
	}
});

function isgameover() {
	if(nospace(board) && noMove(board)) {
		gameOver();
	}
}

function gameOver() {
	alert("游戏结束！");
}

/**
 * 向左移动
 */
function moveLeft() {
	if(!canMoveLeft(board)) {
		return false;
	} else {
		for(var i = 0; i < 4; i++) {
			for(var j = 1; j < 4; j++) {
				//如果该格子有数字，则进行其他判断
				if(board[i][j] != 0) {
					for(var k = 0; k < j; k++) {
						if(board[i][k] == 0 && noBlock1(i, j, k, board)) {
							//move
							showMove(i, j, i, k);
							board[i][k] = board[i][j];
							board[i][j] = 0;
							continue;
						} else if(board[i][k] == board[i][j] && noBlock1(i, j, k, board) && !hasConficted[i][k]) {
							//move
							showMove(i, j, i, k);
							//add
							board[i][k] += board[i][j];
							board[i][j] = 0;
							//分数增加
							score += board[i][k];
							updateScore(score);
							hasConficted[i][k] = true;
							continue;
						}
					}
				}
			}
		}
		setTimeout("updateBoardView()", 200);
		return true;
	}

}

/**
 * 向右移动
 */
function moveRight() {
	if(!canMoveRight(board)) {
		return false;
	} else {
		for(var i = 0; i < 4; i++) {
			for(var j = 2; j >= 0; j--) {
				if(board[i][j] != 0) {
					for(var k = 3; k > j; k--) {
						if(board[i][k] == 0 && noBlock1(i, j, k, board)) {
							//move
							showMove(i, j, i, k);
							board[i][k] = board[i][j];
							board[i][j] = 0;
							continue;
						} else if(board[i][k] == board[i][j] && noBlock1(i, j, k, board) && !hasConficted[i][k]) {
							//move
							showMove(i, j, i, k);
							//add
							board[i][k] *= 2;
							board[i][j] = 0;
							//分数增加
							score += board[i][k];
							updateScore(score);
							hasConficted[i][k] = true;
							continue;
						}
					}
				}
			}
		}
		setTimeout("updateBoardView()", 200);
		return true;
	}
}

/**
 * 向上移动
 */
function moveUp() {
	if(!canMoveUp(board)) {
		return false;
	} else {
		for(var j = 0; j < 4; j++) {
			for(var i = 1; i < 4; i++) {
				console.log(board);
				if(board[i][j] != 0) {
					for(var k = 0; k < i; k++) {
						if(board[k][j] == 0 && noBlock2(j, k, i, board)) {
							//move
							showMove(i, j, k, j);
							board[k][j] = board[i][j];
							board[i][j] = 0;
							continue;
						} else if(board[k][j] == board[i][j] && noBlock2(j, k, i, board) && !hasConficted[k][j]) {
							//move
							showMove(i, j, k, j);
							//add
							board[k][j] *= 2;
							board[i][j] = 0;
							//分数增加
							score += board[k][j];
							updateScore(score);
							hasConficted[k][j] = true;
							continue;
						}
					}
				}
			}
		}
		setTimeout("updateBoardView()", 200);
		return true;
	}
}

/**
 * 向下移动
 */
function moveDown() {
	if(!canMoveDown(board)) {
		return false;
	} else {
		for(var j = 0; j < 4; j++) {
			for(var i = 2; i >= 0; i--) {
				console.log(board);
				if(board[i][j] != 0) {
					for(var k = 3; k > i; k--) {
						if(board[k][j] == 0 && noBlock2(j, i, k, board)) {
							//move
							showMove(i, j, k, j);
							board[k][j] = board[i][j];
							board[i][j] = 0;
							continue;
						} else if(board[k][j] == board[i][j] && noBlock2(j, i, k, board) && !hasConficted[k][j]) {
							//move
							showMove(i, j, k, j);
							//add
							board[k][j] *= 2;
							board[i][j] = 0;
							//分数增加
							score += board[k][j];
							updateScore(score);
							hasConficted[k][j] = true;
							continue;
						}
					}
				}

			}
		}
		setTimeout("updateBoardView()", 200);
		return true;
	}
}