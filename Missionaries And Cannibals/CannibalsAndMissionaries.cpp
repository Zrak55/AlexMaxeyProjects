#include <iostream>
#include <string>
#include <cstdlib>
#include <Queue>
#include <Stack>
#include <list>

using namespace std;

class State
{
	public:
		State(int n);
		State(int n, int lm, int lc, int bs, int m, State* s);	//constructors
		bool Solved();		//returns true if it is a solution state, then prints the solution
		bool ValidMove(int m, int c);	//returns true if a move is allowed (proper number of M and C, etc)
		void PrintState();		//prints out the state as (LM, LC, RM, RC)
		bool IsEqual(State *s2);	//returns true if two states are equal
		bool NotPrevious(State *s);		//returns true if the state has not been visited in this sequence of states
		int GetLM();	//gets the left missionary value
		int GetLC();	//gets the left cannibal value
		int GetBoatSide();	//returns the side the boat is on
		State *previousState;		//the previous state this particular state came from
		int numMoves;			//the number of moves it took to reach this point
		void PrintSolution();		//used to print the solution to a problem
	private:
		int LM;		
		int RM;
		int LC;
		int RC;
		int BoatSide;	//1 if boat is on left, -1 if boat is on right
		
		
	
	
};








//runs a Breadth First Search to find the shortest path
void BFSSolution(int num, int boatCap)
{
	State* InitState = new State(num);
	int best = 1000000;	//infinity
	
	queue<State*> q;	//queue for BFS
	q.push(InitState);
	
	
	while( !q.empty()  )
	{
		State* tmp = q.front();
		q.pop();		//retreive top state
		tmp->PrintState();	//print it
		for(int i = 0; i <= boatCap; i++)
		{
			for(int j = 0; j<=boatCap - i; j++)		//run through all possible moves
			{
				bool move = tmp->ValidMove(i,j);		//ensure move is legal
				if(move)
				{
					int direction = -1 * tmp->GetBoatSide();
					int nlm = tmp->GetLM() + (direction * i);
					int nlc = tmp->GetLC() + (direction * j);
					//cout << i << " " << j << endl;
					State* tmp2 = new State(num, nlm, nlc, -1*tmp->GetBoatSide(), tmp->numMoves + 1, tmp);	//build new state
					if(tmp2->Solved())	//check if this is the solution state
					{
						return;	//stop
					}
					else if(tmp2->previousState->NotPrevious(tmp2))	//if we haven't visited this state yet
					{
						q.push(tmp2);	//add this state to be expanded on
					}
					
				}
			}
		}
	}
	cout << "Solution not found" << endl;	//if we don't return by this point, there is no solution
}
//recursively print the solution from the original state
void State::PrintSolution()
{
	if(this == NULL)
	{
		cout << "Solution: " << endl;
		return;
	}
	else
	{
		previousState->PrintSolution();
		PrintState();
	}
}
//Construct initial state
State::State(int n)
{
	LM = n;
	RM = 0;
	LC = n;
	RC = 0;
	numMoves = 0;
	BoatSide = 1;
	previousState = NULL;
}
//build a new state
State::State(int n, int lm, int lc, int bs, int m, State* s)
{
	LM = lm;
	LC = lc;
	RM = n-lm;
	RC = n-lc;
	numMoves = m;
	BoatSide = bs;
	previousState = s;
}
int State::GetLC()
{
	return LC;
}
int State::GetLM()
{
	return LM;
}
int State::GetBoatSide()
{
	return BoatSide;
}

//if LM, LC, and BoatSide are equal, the states must be the same
bool State::IsEqual(State *s2)
{
	return LM == s2->LM && LC == s2->LC && BoatSide == s2->BoatSide;
}
//given the input state, recursively ensure we have not reached this state before
bool State::NotPrevious(State *s)
{
	if(this == NULL)
	{
		return true;
	}
	else if(this->IsEqual(s))
	{
		return false;
	}
	else
	{
		//cout << "Going recursive" << endl;
		return previousState->NotPrevious(s);
	}
}

void State::PrintState()
{
	cout << "( " << LM <<", "<<LC << ", "<<RM<< ", "<<RC << ")" << endl;
}
//If left M and left C are both 0, we are done
bool State::Solved()
{
	if(LC == 0 && LM == 0)
	{
		cout << "Solution found!  "<< numMoves << " moves taken. " << endl;
		PrintSolution();
		return true;
	}
	else
	{
		return false;
	}
}
bool State::ValidMove(int m, int c)
{
	//cout << "Checking Move" << endl;
	
	int nlm = LM + (m * BoatSide*-1);
	int nrm = RM + (m * BoatSide);
	int nlc = LC + (c * BoatSide * -1);
	int nrc = RC + (c * BoatSide);			//calculate new M and C values
	
	if( (nrc > nrm && nrm > 0) ||	//more right side cannibals
	(nlc > nlm && nlm > 0)  ||	//more left side cannibals
	nlm < 0 || nrm < 0 || nlc < 0 || nrc < 0 ||	//move more than there are
	(c > m && m > 0) ||		//not too many on the boat
	(c==0 && m == 0) )						//both aren't 0
	{
	//	cout << "false" << endl;
		return false;
	}
	else
	{
	//	cout << "True"<< endl;
		return true;
	}
}
	

	
int main()
{
	
	int bc = -1;
	int num = -1;
	while(num <= 0)
	{
		cout << "Enter number of Missionaries and Cannibals (must be greater than 0)" << endl;
		cin >> num;
	}
	while(bc <= 0)
	{
		cout << "Enter capacity of the boat (must be greater than 0)" << endl;
		cin >> bc;
	}
	BFSSolution(num, bc);
	
	return 0;
}





