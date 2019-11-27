/*
game.js for Perlenspiel 3.3.x
Last revision: 2018-10-14 (BM)

Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
This version of Perlenspiel (3.3.x) is hosted at <https://ps3.perlenspiel.net>
Perlenspiel is Copyright © 2009-18 Worcester Polytechnic Institute.
This file is part of the standard Perlenspiel 3.3.x devkit distribution.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with the Perlenspiel devkit. If not, see <http://www.gnu.org/licenses/>.
*/

/*
This JavaScript file is a template for creating new Perlenspiel 3.3.x games.
By default, all event-handling function templates are COMMENTED OUT (using block-comment syntax), and are therefore INACTIVE.
Uncomment and add code to the event handlers required by your project.
Any unused event-handling function templates can be safely deleted.
Refer to the tutorials and documentation at <https://ps3.perlenspiel.net> for details.
*/

/*
The following comment lines are for JSHint <https://jshint.com>, a tool for monitoring code quality.
You may find them useful if your development environment is configured to support JSHint.
If you don't use JSHint (or are using it with a configuration file), you can safely delete these lines.
*/

/* jshint browser : true, devel : true, esversion : 5, freeze : true */
/* globals PS : true */

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.init() event handler:



var G = ( function () {
	// By convention, constants are all upper-case
   
	var WIDTH = 32; // width of grid
	var HEIGHT = 25; // height of grid
   
	//color presets
	var COLOR_PLAYER = PS.COLOR_GREEN;
	var COLOR_FLOOR = PS.COLOR_WHITE; 
	var COLOR_WALL = PS.COLOR_BLACK; 
	var COLOR_SELECT = PS.COLOR_BLUE;
	var COLOR_NORMAL = PS.COLOR_RED;
	var COLOR_ZAP = PS.COLOR_YELLOW;
	var COLOR_FAST = PS.COLOR_ORANGE;
	var COLOR_BIG = [138,43,226];

	//values stored in map
	var PLAYER_VAL = 8;
	var WALL_VAL = 0;
	var FLOOR_VAL = 1;
	var NORMAL_ENEMY_VAL = 2;
	var ENEMY_TMP_VAL = 3;
	var FAST_ENEMY_VAL = 'x';
	var FAST_ENEMY_TMP_VAL = 'z';
	var BIG_ENEMY_VAL = 'n';
	var BIG_ENEMY_TMP_VAL = 'm';	//tmp vals are used to make sure we don't move a unit twice
	var SCAN_VAL = 4;
	var COL_VAL = 5;
	var ROW_VAL = 6;
	var PLUS_VAL = 7;
	var SQUARE_VAL = 9;

	//values for battery and costs of actions
	var BATTERY = 300;	
	var cur_battery = BATTERY; 
	var COL_COST = 15;
	var ROW_COST = 15;
	var PLUS_COST = 40;
	var SQUARE_COST = 10;
	var SCAN_COST = 5;

	//timers
	var myTimer;
	var spawnTimer;
	var scanTimer;
	var nxtLvlTimer;
	var tipTimer;

	var isScanning = false;	//set to true for monster testing

	// life/score
	var TOTAL_LIFE = 3;
	var life = TOTAL_LIFE;
   	var score = 0;

	var grab_x; // current x-pos of character
	var grab_y; // current y-pos of character
   

	//keeps track of what weapon is being used
	var cur_weapon = SQUARE_VAL;
   
	var curSpawnTick = 240;

	//array representation of board
	var map = [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 4, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 5, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 6, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 7, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 9, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		];
		
		

		//draw_map
		//draws the map based on the given values in the map array
		var draw_map = function()
		{
			var x,y,data;
			for(y=0; y<HEIGHT; y++)
			{
				for(x = 0; x<WIDTH; x++)
				{
					data = G.getSquare(x, y);
					
						if(data == WALL_VAL)
						{
							PS.color(x,y,COLOR_WALL);
						}
						else if(data == FLOOR_VAL)
						{
							PS.color(x,y,COLOR_FLOOR);
						}
						else if(isScanning && data == NORMAL_ENEMY_VAL)
						{
							PS.color(x,y,COLOR_NORMAL);
						}
						else if(isScanning && data == FAST_ENEMY_VAL)
						{
							PS.color(x, y, COLOR_FAST);
						}
						else if(isScanning && data == BIG_ENEMY_VAL)
						{
							PS.color(x, y, COLOR_BIG);
						}
						else{
						}
				}
			}
			
			
			grab_x = 19;
			grab_y = 12;
			map[(grab_y*WIDTH) + grab_x] = PLAYER_VAL;
			PS.color(grab_x, grab_y, COLOR_PLAYER);
		};

		var next_level = function()
		{
			if(curSpawnTick > 60)
			{
				PS.statusText("Next Level!!!");
				PS.timerStop(spawnTimer);
				curSpawnTick -= 60;
				spawnTimer = PS.timerStart(curSpawnTick, spawnEnemy);

			}
		};

		//checks if the loss of life resulted in a lose
		var check_loss = function()
		{
			if(life == 0)
			{
				PS.audioPlay("fx_wilhelm");
				PS.timerStop(myTimer);
				PS.timerStop(spawnTimer);
				PS.timerStop(nxtLvlTimer);
				cur_battery = 0;
				isScanning = false;
				PS.statusText("Game Over! Score: " + score);
				
			}
		}


		//draws the tools and glyphs on the keft side of the map
		var draw_tools = function()
		{
			//Scan
			PS.glyph(1, 2, 'S');
			PS.glyph(2,2,'C');
			PS.glyph(3, 2, 'A');
			PS.glyph(4, 2, 'N');
			PS.color(5,2, COLOR_SELECT);
			
			PS.glyph(5,1,'5');

			//collumn attack
			var i, j;
			for(i = 1; i<4; i++)
			{
				for(j = 4; j<7; j++)
				{
					PS.color(i, j, PS.COLOR_RED);
					if(j==4)
					{
						PS.glyph(i,j, '^');
					}
					else if(j == 6)
					{
						PS.glyph(i,j,'v')
					}
				}
			}
			PS.color(5, 5, COLOR_SELECT);
			PS.glyph(4,4,'1');
			PS.glyph(5,4,'5');

			//row attack
			for(i = 1; i<4; i++)
			{
				for(j = 8; j<11; j++)
				{
					PS.color(i, j, PS.COLOR_RED);
					if(i==1)
					{
						PS.glyph(i,j, '<');
					}
					else if(i == 3)
					{
						PS.glyph(i,j,'>')
					}
				}
			}
			PS.color(5, 9, COLOR_SELECT);
			PS.glyph(4,8,'1');
			PS.glyph(5,8,'5');

			//plus attack
			for(i = 1; i<4; i++)
			{
				for(j = 12; j<15; j++)
				{
					if(j == 12)
					{
						PS.glyph(i, j, '^');
					}
					else if(j == 14)
					{
						PS.glyph(i,j,'v');
					}
					PS.color(i, j, PS.COLOR_RED);
					if(i==1)
					{
						PS.glyph(i,j, '<');
					}
					else if(i == 3)
					{
						PS.glyph(i,j,'>')
					}
					
				}
			}
			PS.glyph(2,13,'+');
			PS.color(5, 13, COLOR_SELECT);
			PS.glyph(4,12,'4');
			PS.glyph(5,12,'0');


			//Square Attack
			for(i = 1; i<4; i++)
			{
				for(j = 16; j<19; j++)
				{
					PS.color(i, j, PS.COLOR_RED);
					
				}
			}
			PS.color(5,17, COLOR_SELECT);
			PS.glyph(4,16,'1');
			PS.glyph(5,16,'0');

		};


		//moves or ticks a single piece
		var move_piece = function (x,y, data)
		{
			if(data.cur_tick < data.move_tick)
			{
				data.cur_tick++;
			}
			if(data.cur_tick >= data.move_tick)
			{
				data.cur_tick = 0;
				var nx, ny;
				if(x < grab_x)
				{
					nx = x + 1;
				}
				else if(x > grab_x)
				{
					nx = x - 1;
				}
				else{
					nx = x;
				}
				if(y < grab_y)
				{
					ny = y + 1;
				}
				else if(y > grab_y)
				{
					ny = y - 1;
				}
				else{
					ny = y;
				}
				
				if(G.getSquare(nx, ny) == PLAYER_VAL)
				{
					map[(y*WIDTH) + x] = FLOOR_VAL;
					PS.data(x, y, PS.DEFAULT);
					life--;
					displayText();
					check_loss();
				}
				else if(G.getSquare(nx, ny) == FLOOR_VAL)
				{
					data.x_pos = nx;
					data.y_pos = ny;
					PS.data(nx, ny, data);
					PS.data(x, y, PS.DEFAULT)
					if(map[(y*WIDTH) + x] == NORMAL_ENEMY_VAL)
					{
						map[(ny*WIDTH) + nx] = ENEMY_TMP_VAL;
						map[(y*WIDTH) + x] = FLOOR_VAL;
					}
					else if(map[(y*WIDTH) + x] == FAST_ENEMY_VAL)
					{
						map[(ny*WIDTH) + nx] = FAST_ENEMY_TMP_VAL;
						map[(y*WIDTH) + x] = FLOOR_VAL;
					}
					else if(map[(y*WIDTH) + x] == BIG_ENEMY_VAL)
					{
						map[(ny*WIDTH) + nx] = BIG_ENEMY_TMP_VAL;
						map[(y*WIDTH) + x] = FLOOR_VAL;
					}
					

				}
			}

		};

		//G.move(h,v)
		//moves all enemies towards the player

		var move = function () {
			var x, y;
			for(x = 0; x<WIDTH; x++)
			{
				for(y=0; y<HEIGHT; y++)
				{
					if(G.getSquare(x,y) == NORMAL_ENEMY_VAL || G.getSquare(x,y) == FAST_ENEMY_VAL || G.getSquare(x,y) == BIG_ENEMY_VAL)
					{
						var data = PS.data(x,y, PS.CURRENT);
						move_piece(x,y,data);
					}
				}
			}
			for(x = 0; x<WIDTH; x++)
			{
				for(y=0; y<HEIGHT; y++)
				{
					if(map[(y*WIDTH) + x] == ENEMY_TMP_VAL)
					{
						map[(y*WIDTH) + x] = NORMAL_ENEMY_VAL;
					}
					else if(map[(y*WIDTH) + x] == FAST_ENEMY_TMP_VAL)
					{
						map[(y*WIDTH) + x] = FAST_ENEMY_VAL;
					}
					else if(map[(y*WIDTH) + x] == BIG_ENEMY_TMP_VAL)
					{
						map[(y*WIDTH) + x] = BIG_ENEMY_VAL;
					}
				}
			}

			draw_map();
			draw_tools();

			score += 10;  //incremental score by time
			if(life > 0 && (score > 50 || cur_battery < BATTERY)) //ensures instrutions could be read
			{
				displayText();

			}
		};



		var spawnEnemy = function()
		{
			//random spawn location
			var x, y;
			var thing = PS.random(4);
			if(thing == 1)
			{
				x = 7;
				y = PS.random(23);
			}
			else if(thing == 2)
			{
				x = 30;
				y = PS.random(23);
			}
			else if(thing == 3)
			{
				x = PS.random(24) + 6;
				y = 1;
			}
			else if(thing == 4)
			{
				x = PS.random(24) + 6;
				y = 23;
			}


			//randomly  type of enemy
			var type = PS.random(3);
			
			//data object used to store information about the enemy
			var data = {
				x_pos: -1,
				y_pos: -1,
				move_tick: -1,
				cur_tick: -1
			};

			data.x_pos = x;
			data.y_pos = y;
			data.cur_tick = 0;
			
			//ticking amount is based on type of enemy
			if(type == 1)
			{
				data.move_tick = 2;
				map[(y*WIDTH) + x] = NORMAL_ENEMY_VAL;
			}
			else if(type == 2)
			{
				data.move_tick = 1;
				map[(y*WIDTH) + x] = FAST_ENEMY_VAL;
			}
			else if(type == 3)
			{
				data.move_tick = 2;
				map[(y*WIDTH) + x] = BIG_ENEMY_VAL;
			}
			PS.data(x, y, data);
		};

		var dmg_square = function(x, y)
		{
			var type = G.getSquare(x, y);
			//if it is a normal or fast enemy, destroy it
			if(type == NORMAL_ENEMY_VAL || type == FAST_ENEMY_VAL)	
			{
				map[(y*WIDTH) + x] = FLOOR_VAL;
				PS.data(x, y, PS.DEFAULT);
				score += 10;
				cur_battery += 5;
			}
			//if it is a big enemy, it becomes a normal enemy
			else if(type == BIG_ENEMY_VAL)
			{
				map[(y*WIDTH) + x] = NORMAL_ENEMY_VAL;
				score += 10;
				cur_battery += 5;
			}
			//hitting an enemy rewards you.  being more efficient with your shots helps you survive
		};

		var fire_col = function(x, y)
		{
			var h, w;
			cur_battery -= COL_COST;
			PS.audioPlay("fx_shoot2");
			for(w = x-1; w<= x+1; w++)
			{
				for(h = 1; h < HEIGHT -1; h++)
				{
					
					PS.color(w, h, COLOR_ZAP);
					dmg_square(w,h);
					
				}
			}
		};
		var fire_row = function(x,y)
		{
			var h, w;
			cur_battery -= ROW_COST;
			PS.audioPlay("fx_shoot5");
			for(w = 7; w< WIDTH-1; w++)
			{
				for(h = y-1; h <= y+1; h++)
				{
					
					PS.color(w, h, COLOR_ZAP);
					dmg_square(w,h);
					
				}
			}
		};
		var fire_plus = function(x,y)
		{
			fire_row(x,y);
			fire_col(x,y);
			cur_battery -= (PLUS_COST - ROW_COST - COL_COST);	//fire row and fire col already drain some battery
		};
		var fire_square = function(x,y)
		{
			var h, w;
			cur_battery -= SQUARE_COST;
			PS.audioPlay("fx_shoot7");
			for(w = x-1; w<= x+1; w++)
			{
				for(h = y-1; h <= y+1; h++)
				{
					
					PS.color(w, h, COLOR_ZAP);
					dmg_square(w,h);
					
				}
			}
		};
		


		/*

		if(numTouches > 0)
		{
			///code.....

			numTouches--;
		}

		*/

		//stop scanning when the timer is up
		var stopScan = function()
		{
			isScanning = false;
			PS.timerStop(scanTimer);	
		};

		//update the text for battery, life, etc?
		var displayText = function()
		{
			PS.statusText("Battery: " + cur_battery.toString() + "/" + BATTERY.toString() + "\tLife: "+ life.toString()+"/"+TOTAL_LIFE.toString() + "\tScore: "+score.toString() );
		};

		var show_tip = function()
		{
			PS.statusText("Tip: Enemies refund 5 energy when hit.");
			PS.timerStop(tipTimer);
			tipTimer = PS.timerStart(1800, show_tip);
		};


	var exports = {
	
	//fires the particular weapon
	fire_weapon : function(x, y)
	{
		
		switch(cur_weapon)
		{
			case COL_VAL:
				{
					if(cur_battery >= COL_COST)
					{
						fire_col(x,y);
					}
					break;
				}
			case ROW_VAL:
			{
				if(cur_battery >= ROW_COST)
				{
					fire_row(x,y);
				}
				break;
			}
			case PLUS_VAL:
				{
					if(cur_battery >= PLUS_COST)
					{
						fire_plus(x,y);
					}
					break;
				}
			case SQUARE_VAL:
				{
					if(cur_battery >= SQUARE_COST)
					{
						fire_square(x,y);
					}
					break;
				}
			default:
				{
					break;
				}
		}
		displayText();
	},
	//reveals enemies
	scan : function()
	{
		if(isScanning == false)
		{
			PS.audioPlay("fx_powerup4");
			isScanning = true;
			cur_battery -= SCAN_COST;
			scanTimer = PS.timerStart(300, stopScan);
			displayText();
		}
		
	},
	
	//selects the weapon or initiates a scan
	make_selection : function(x, y)
	{
		var select_type = G.getSquare(x,y);
		switch(select_type)
		{
			case SCAN_VAL:
				{
					if(cur_battery>=SCAN_COST)	//must have battery available
					{
						this.scan();
					}
					break;
				}
			case COL_VAL:
				{
					cur_weapon = COL_VAL;
					break;
				}
			case ROW_VAL:
				{
					cur_weapon = ROW_VAL;
					break;
				}
			case PLUS_VAL:
				{
					cur_weapon = PLUS_VAL;
					break;
				}
			case SQUARE_VAL:
				{
					cur_weapon = SQUARE_VAL;
					break;
				}
			default:
				{	

					break;
				}
		}
	},

	//gets the value of a square
	getSquare : function (x, y)
	{
		var num = map[(y*WIDTH) + x];
		return num;
	},


	// G.init()
	// Initializes the game
   
	init : function () {
		PS.gridSize( WIDTH, HEIGHT ); // init grid
		PS.color( PS.ALL, PS.ALL, COLOR_FLOOR );
		PS.border( PS.ALL, PS.ALL, 0 ); // no borders
   
   
		draw_map();
		draw_tools();

		myTimer = PS.timerStart(60, move);
		spawnTimer = PS.timerStart(curSpawnTick, spawnEnemy);
		nxtLvlTimer = PS.timerStart(3600, next_level);
		tipTimer = PS.timerStart(600, show_tip);
		spawnEnemy();

   
		PS.audioLoad( "fx_shoot2" );
 		PS.audioLoad( "fx_shoot5" );
		PS.audioLoad( "fx_shoot6" );
		PS.audioLoad("fx_shoot7");
		PS.audioLoad("fx_shoot8");
		PS.audioLoad("fx_powerup4");

		PS.audioLoad("fx_wilhelm");
	 
		PS.statusText("Blue Squares: Scan to see, select a weapon.");

	}
	
	};
   
	// Return the 'exports' object as the value
	// of this function, thereby assigning it
	// to the global G variable. This makes
	// its properties visible to Perlenspiel.
   
	return exports;
   } () );
   
   // Tell Perlenspiel to use our G.init() function
   // to initialize the game
   
   PS.init = G.init;


/*

PS.init = function( system, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line
	// to verify operation:

	 PS.debug( "PS.init() called\n" );

	// This function should normally begin
	// with a call to PS.gridSize( x, y )
	// where x and y are the desired initial
	// dimensions of the grid.
	// Call PS.gridSize() FIRST to avoid problems!
	// The sample call below sets the grid to the
	// default dimensions (8 x 8).
	// Uncomment the following code line and change
	// the x and y parameters as needed.

	 PS.gridSize( 15, 15 );

	// This is also a good place to display
	// your game title or a welcome message
	// in the status line above the grid.
	// Uncomment the following code line and
	// change the string parameter as needed.

	 PS.statusText( "Game" );

	// Add any other initialization code you need here.
};
*/


/*
PS.touch ( x, y, data, options )
Called when the left mouse button is clicked over bead(x, y), or when bead(x, y) is touched.
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.touch() event handler:



PS.touch = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

	if(x<=6)
	{
		G.make_selection(x,y);
	}
	else
	{
		G.fire_weapon(x,y);
	}
	
	
};



/*
PS.release ( x, y, data, options )
Called when the left mouse button is released, or when a touch is lifted, over bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.release() event handler:

/*

PS.release = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead.
};

*/

/*
PS.enter ( x, y, button, data, options )
Called when the mouse cursor/touch enters bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.enter() event handler:

/*

PS.enter = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead.
};

*/

/*
PS.exit ( x, y, data, options )
Called when the mouse cursor/touch exits bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.exit() event handler:

/*

PS.exit = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead.
};

*/

/*
PS.exitGrid ( options )
Called when the mouse cursor/touch exits the grid perimeter.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.exitGrid() event handler:

/*

PS.exitGrid = function( options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to verify operation:

	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid.
};

*/

/*
PS.keyDown ( key, shift, ctrl, options )
Called when a key on the keyboard is pressed.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.keyDown() event handler:



PS.keyDown = function( key, shift, ctrl, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect first three parameters:


	

};



/*
PS.keyUp ( key, shift, ctrl, options )
Called when a key on the keyboard is released.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.keyUp() event handler:

/*

PS.keyUp = function( key, shift, ctrl, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyUp(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is released.
};

*/

/*
PS.input ( sensors, options )
Called when a supported input device event (other than those above) is detected.
This function doesn't have to do anything. Any value returned is ignored.
[sensors : Object] = A JavaScript object with properties indicating sensor status; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: Currently, only mouse wheel events are reported, and only when the mouse cursor is positioned directly over the grid.
*/

// UNCOMMENT the following code BLOCK to expose the PS.input() event handler:

/*

PS.input = function( sensors, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code lines to inspect first parameter:

//	 var device = sensors.wheel; // check for scroll wheel
//
//	 if ( device ) {
//	   PS.debug( "PS.input(): " + device + "\n" );
//	 }

	// Add code here for when an input event is detected.
};

*/

/*
PS.shutdown ( options )
Called when the browser window running Perlenspiel is about to close.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: This event is generally needed only by applications utilizing networked telemetry.
*/

// UNCOMMENT the following code BLOCK to expose the PS.shutdown() event handler:

/*

PS.shutdown = function( options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to verify operation:

	// PS.debug( "“Dave. My mind is going. I can feel it.”\n" );

	// Add code here to tidy up when Perlenspiel is about to close.
};

*/




/*
PS.data(bx, by, 1);



for (x = 0; x<Width; x++)
{
	for(y = 0; y<Height; y++)
	{
		var i = PS.data(x,y PS.CURRENT)
		{
			if(i == 1)
			{
				PS.color(x,y, COLOR_ORANGE);
				i++;
				Ps.data(x,y i);
			}
			else if(i == 2)
			{
				PS.color(x+1, y, COLOR_ORANGE)
				PS.color(x+1, y+1, COLOR_ORANGE)
				PS.color(x-1, y, COLOR_ORANGE)
				PS.color(x-1, y+1, COLOR_ORANGE)		//set new floors to orange

				PS.color(x+1, y, COLOR_FLOOR)		//reset old bomb
				i++
				Ps.data(x,y i);    //increment data, go to next explosion stage
			}
			else if(i == 3)
			{
				PS.color(x+1, y, COLOR_Floor)			//reset old color
				PS.color(x+1, y+1, COLOR_FLOOR)
				PS.color(x-1, y, COLOR_FLOOR)
				PS.color(x-1, y+1, COLOR_Floor)

				PS.color(x+2, y, COLOR_ORANGE)				
				PS.color(x+2, y+1, COLOR_ORANGE)
				PS.color(x-2, y, COLOR_ORANGE)
				PS.color(x-2, y+2, COLOR_ORANGE)
				PS.color(x+2, y, COLOR_ORANGE)
				PS.color(x+2, y+2, COLOR_ORANGE)
				i++
				Ps.data(x,y i);
				
			}
			... //spread as you want
			else if(i == 5)
			{
				PS.data(x, y, PS.DEFAULT);	//no more exploding
			}
		}
	}
}

*/
