#include <iostream>
#include <fstream>
#include <stdlib.h>
#include <iomanip>
#include <ctime>

using namespace std;

int attackerDice[] = {0,0,0};
int defenderDice[] = {0,0,0}; //despite a max of 2 dice, this must be size 3 so that it works properly with findMax without adding unnecessary code
int attackerWins=0;
int defenderWins=0;

int findMax(int vals[]);
void calcWin(int AD, int DD);
void roll(int numAD, int numDD);
void simFight(int ad, int dd);
void menu();

int main()
{
	srand(time(NULL)); //sets a random seed for the random number generator so that it doesn't produce the same random sequence every time
						//rand only gives a pseudo-random value so a different seed must be chosen every time
	menu();
	return 0;
}

//void findMax
//pre:pre is an array of size 3
//post:the largest value of the array is returned
//		the largest value is set to 0 so it can't be used again 
int findMax(int vals[])
{
	int ret = 0;
	int loc = -1;
	for(int i=0; i<3; i++)
	{
		if(vals[i]>ret)
		{
			ret = vals[i];
			loc = i;
		}
	}
	vals[loc] = 0;
	return ret;
}

//void calcWin
//calculates who wins and loses a fight, incrementing the total scores
//pre: AD and DD are between 1 and 6
//post: the outcome is recorded and printed
void calcWin(int AD, int DD)
{
	if(AD>DD)
	{
		attackerWins++;
		cout<<"Attacker kills 1 army"<<endl;
	}
	else
	{
		defenderWins++;
		cout<<"Defender kills 1 army"<<endl;
	}
}

//void roll
//pre: numAD and numDD are the number of dice the attacker and defender are rolling
//post: a random number 1-6 is inputted into the proper global arrays for each time it was supposed to be rolled
void roll(int numAD, int numDD)
{
	for(int i=0; i<numAD; i++) //goes for how many times it is supposed to roll
	{
		attackerDice[i]=rand() % 6 + 1; //random value
	}
	for(int j=0; j<numDD; j++) //goes for how many times it is supposed to roll
	{
		defenderDice[j]=rand() % 6 + 1; //random value
	}
}

//void simFight
//simulates one combat
//pre: ad and dd are the number of dice to be rolled by attacker and defender, respectively
//post: the results of the combat are printed and the result is added into the global variables
void simFight(int ad, int dd)
{
	roll(ad, dd); //rolls the random values
	cout<<"Attacker Dice: ";
	for(int i=0; i<ad; i++)
	{
		cout<<attackerDice[i]<<" "; //prints what the attacker rolled
	}
	cout<<"\nDefender Dice: ";
	for(int i=0; i<dd; i++)
	{
		cout<<defenderDice[i]<<" "; //prints defender rolls
	}
	cout<<"\n";
	int z;
	if(ad>dd)
	{
		z=dd;
	}
	else
	{
		z=ad;
	} //gives the proper number fights to happen in any one combat
	for(int i = 0; i<z; i++)
	{
		int am = findMax(attackerDice); //finds the max vaue
		int dm = findMax(defenderDice);  
		calcWin(am, dm); //calculates who wins
	}
}

//void menu
//works the user interface for the program
//allows for use of other functions of the program
void menu()
{
	int e = 0;
	while(e==0)
	{
		cout<<"Welcome to Risk Simulator"<<endl;
		cout<<"1: Show total attacker and defender wins"<<endl;
		cout<<"2: Run 1 sim"<<endl;
		cout<<"3: Run 10 sims"<<endl;
		cout<<"4: Run 100 sims"<<endl;
		cout<<"5: Run 1000 sims"<<endl;
		cout<<"6: Rules for simulations *READ FIRST*"<<endl;
		cout<<"7: Exit"<<endl;
		int x;
		cin >> x;
		switch(x)
		{
			case 1:
				{
					cout<<"Attacker wins: "<<attackerWins<<endl;
					cout<<"Defender Wins: "<<defenderWins<<endl;
					if(defenderWins+attackerWins!=0)
					{
						
						double win = (double)attackerWins/(double)(attackerWins+defenderWins);
						cout<<"Attacker win %: ";
						cout << fixed;
   						cout << setprecision(4);
    					cout << win;
						cout<<"\n";	
					}
					break;
				}
			case 2:
				{
					
					cout<<"Attacker Dice:";
					int x;
					cin >> x;
					cout<<"\nDefender Dice:";
					int y;
					cin >> y;
					simFight(x, y);
					break;
				}
			case 3:
				{
					cout<<"Attacker Dice:";
					int x;
					cin >> x;
					cout<<"\nDefender Dice:";
					int y;
					cin >> y;
					for(int i=0; i<10; i++)
					{
						simFight(x,y);
					}
					break;
				}
			case 4:
				{
					cout<<"Attacker Dice:";
					int x;
					cin >> x;
					cout<<"\nDefender Dice:";
					int y;
					cin >> y;
					for(int i=0; i<100; i++)
					{
						simFight(x,y);
					}
					break;
				}
			case 5:
				{
					cout<<"Attacker Dice:";
					int x;
					cin >> x;
					cout<<"\nDefender Dice:";
					int y;
					cin >> y;
					for(int i=0; i<1000; i++)
					{
						simFight(x,y);
					}
					break;
				}
			case 6:
			{
				cout<<"Combat in Risk goes by the following rules: The attacker rolls 1-3 dice, and the defender rolls 1-2 dice.  (Dice are 6 sided)"<<endl;
				cout<<"First, both players compare the highest die rolled.  Whoever has the higher die kills an army of the loser, defender winning ties"<<endl;
				cout<<"Next, if both players have a second die to compare, the process is repeated for each player's second highest die roll, following the same rules"<<endl;
				cout<<"\nWhen working with this program, please ensure you do not use more than 3 dice for the attacker, more than 2 dice for the defender, or input a negative number"<<endl;
				cout<<"The program won't like that :) Have fun running risk battle simulations!\n"<<endl;
				break;
			}
			case 7:
				{
					e=1;
					break;
				}
			default:
				{
					cout<<"Invalid Input"<<endl;
					break;
				}
		}
	}
}



