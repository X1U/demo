//获取屏幕的大小
documentWidth = window.screen.availWidth;
//容器大小
gridContainerWidth = 0.92 * documentWidth;
//每个格子的大小
cellSideLength = 0.18 * documentWidth;
//每个格子的间距
cellSpace = 0.04 * documentWidth;

/**
 * 通过横坐标获取间距
 */
function getPosTop(i, j){
	return cellSpace + i * (cellSpace+cellSideLength);
}

/**
 * 通过纵坐标获得间距
 */
function getPosLeft(i, j){
	return cellSpace + j * (cellSpace+cellSideLength);
}

/**
 * 获得对应数字的背景颜色
 */
function getNumberBackgroundColor(number){
	switch(number){
		case 2 : return "#eee4da";break;
		case 4 : return "#ede0c8";break;
		case 8 : return "#f2b179";break;
		case 16 : return "#f59563";break;
		case 32 : return "#f67c5f";break;
		case 64 : return "#f65e3b";break;
		case 128 : return "#edcf72";break;
		case 256 : return "#edcc61";break;
		case 512 : return "#9c0";break;
		case 1024 : return "#33b5e5";break;
		case 2048 : return "#09c";break;
		case 4096 : return "#a6c";break;
		case 8192 : return "#93c";break;
	}
	
	return 'black';
}

/**
 * 获得数字的前景色
 */
function getNumberColor(number){
	if(number <= 4){
		return "#776e65"
	}else{
		return "white";
	}
}

/**
 * 是否有空间
 */
function nospace(board){
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if(board[i][j] == 0){
				return false;
			}
		}
	}
	return true;
}

/**
 * 是否能够向左移动
 */
function canMoveLeft(){
	for (var i = 0; i < 4; i++) {
		for (var j = 1; j < 4; j++) {
			if( board[i][j] != 0 ){
				//如果这个格子有数字则判断此格子的左边有没有格子或者数字是否相同
				if(board[i][j-1] == 0 || board[i][j-1] == board[i][j]){
					return true;
				}
			}
		}
	}
	return false;
}

/**
 * 是否能够向右移动
 */
function canMoveRight(board){
	for (var i = 0; i < 4; i++) {
		for (var j = 2; j >= 0; j--) {
			if( board[i][j] != 0 ){
				//如果这个格子有数字则判断此格子的右边有没有格子或者数字是否相同
				if(board[i][j+1] == 0 || board[i][j+1] == board[i][j]){
					return true;
				}
			}
		}
	}
	return false;
}

/**
 * 能否向上移动
 */
function canMoveUp(board){
	for (var j = 0; j < 4; j++) {
		for (var i = 1; i < 4; i++) {
			if( board[i][j] != 0 ){
				//如果这个格子有数字则判断此格子的上边有没有格子或者数字是否相同
				if(board[i-1][j] == 0 || board[i-1][j] == board[i][j]){
					return true;
				}
			}
		}
	}
	return false;
}


/**
 * 能否向下移动
 */
function canMoveDown(board){
	console.log(board)
	for (var j = 0; j < 4; j++) {
		for (var i = 2; i >= 0; i--) {
			if( board[i][j] != 0 ){
				//如果这个格子有数字则判断此格子的下边有没有格子或者数字是否相同
				if(board[i+1][j] == 0 || board[i+1][j] == board[i][j]){
					return true;
				}
			}
		}
	}
	return false;
}

/**
 * 判断左右没有障碍物阻碍
 */
function noBlock1(x, y1, y2, board){
	for (var i = y1 + 1; i < y2; i++) {
		if( board[x][i] != 0 ){
			return false;
		}
	}
	return true;
}

/**
 * 判断上下是否有障碍
 */
function noBlock2(y, x1, x2, board){
	for (var i = x1 + 1; i < x2; i++) {
		if( board[i][y] != 0 ){
			return false; 
		}
	}
	return true;
}


/**
 * 是否能够移动
 */
function noMove( board ){
	if( canMoveDown( board ) || canMoveLeft( board ) || canMoveRight( board ) || canMoveUp( board ) ){
		return false;
	}else{
		return true;
	}
}
