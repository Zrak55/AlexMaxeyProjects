using System;
using System.Collections;
using System.Collections.Generic;

namespace CaM
{


	class State
	{

		//Construct initial state
		public State(int n)
		{
			LM = n;
			RM = 0;
			LC = n;
			RC = 0;
			numMoves = 0;
			BoatSide = 1;
			previousState = null;
		}
		//Build a new state
		public State(int n, int lm, int lc, int bs, int m, State s)  //constructors
		{
			LM = lm;
			LC = lc;
			RM = n - lm;
			RC = n - lc;
			numMoves = m;
			BoatSide = bs;
			previousState = s;
		}
		public bool Solved()     //returns true if it is a solution state, then prints the solution
		{
			if (LC == 0 && LM == 0)
			{
				Console.WriteLine("Solution found!  " + numMoves + " moves taken. ");
				PrintSolution();
				return true;
			}
			else
			{
				return false;
			}
		}
		public bool ValidMove(int m, int c)   //returns true if a move is allowed (proper number of M and C, etc)
		{
			int nlm = LM + (m * BoatSide * -1);
			int nrm = RM + (m * BoatSide);
			int nlc = LC + (c * BoatSide * -1);
			int nrc = RC + (c * BoatSide);          //calculate new M and C values

			if ((nrc > nrm && nrm > 0) ||   //more right side cannibals
			(nlc > nlm && nlm > 0) ||   //more left side cannibals
			nlm < 0 || nrm < 0 || nlc < 0 || nrc < 0 || //move more than there are
			(c > m && m > 0) ||     //not too many on the boat
			(c == 0 && m == 0))                     //both aren't 0
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
		public void PrintState()      //prints out the state as (LM, LC, RM, RC)
		{
			Console.WriteLine("( " + LM + ", " + LC + ", " + RM + ", " + RC + ")");
		}

		//if LM, LC, and BoatSide are equal, the states must be the same
		public bool IsEqual(State s2)    //returns true if two states are equal
		{
			return LM == s2.LM && LC == s2.LC && BoatSide == s2.BoatSide;
		}
		//given the input state, recursively ensure we have not reached this state before
		public bool NotPrevious(State s)
		{
			if (this == null)
			{
				return true;
			}
			else if (this.IsEqual(s))
			{
				return false;
			}
			else
			{
				if(previousState == null)
				{
					return true;
				}
				else
					return previousState.NotPrevious(s);
			}
		}
		public State previousState;       //the previous state this particular state came from
		public int numMoves;           //the number of moves it took to reach this point
									   //recursively print the solution from the original state
		private void PrintSolution()
		{
			if (this == null)
			{
				Console.WriteLine("Solution: ");
				return;
			}
			else
			{
				if(previousState != null)
					previousState.PrintSolution();
				PrintState();
			}
		}

		public int LM { get; }
		public int RM { get; }
		public int LC { get; }
		public int RC { get; }
		public int BoatSide { get; set; }   //1 if boat is on left, -1 if boat is on right






	};




	public static class Searcher
	{
		private static void AddState(State a, Stack<State> s, List<State> u)
		{
			State inList = null;
			foreach(var state in u)
			{
				if(a.IsEqual(state))
				{
					inList = state;
				}
			}
			if(inList == null)
			{
				u.Add(a);
				s.Push(a);
			}
			else if(a.numMoves < inList.numMoves)
			{
				u.Remove(inList);
				u.Add(a);
				s.Push(a);
			}
		}
		private static void AddState(State a, Queue<State> q, List<State> u)
		{
			State inList = null;
			foreach (var state in u)
			{
				if (a.IsEqual(state))
				{
					inList = state;
				}
			}
			if (inList == null)
			{
				u.Add(a);
				q.Enqueue(a);
			}
			else if (a.numMoves < inList.numMoves)
			{
				u.Remove(inList);
				u.Add(a);
				q.Enqueue(a);
			}
		}

		public static void DFSSolution(int num, int boatCap)
		{
			List<State> usedStates = new List<State>();


			State InitState = new State(num);
			State best = null;

			Stack<State> s = new Stack<State>();    //queue for BFS
			AddState(InitState, s, usedStates);


			while (s.Count > 0)
			{
				State tmp = s.Peek();
				s.Pop();        //retreive top state
				tmp.PrintState();  //print it
				for (int i = 0; i <= boatCap; i++)
				{
					for (int j = 0; j <= boatCap - i; j++)      //run through all possible moves
					{
						bool move = tmp.ValidMove(i, j);       //ensure move is legal
						if (move)
						{
							int direction = -1 * tmp.BoatSide;
							int nlm = tmp.LM + (direction * i);
							int nlc = tmp.LC + (direction * j);
							//cout << i << " " << j << endl;
							State tmp2 = new State(num, nlm, nlc, -1 * tmp.BoatSide, tmp.numMoves + 1, tmp);    //build new state
							if (tmp2.Solved()) //check if this is the solution state
							{
								if (best == null || tmp2.numMoves < best.numMoves)
								{
									best = tmp2;
								}
							}
							else if (tmp2.previousState.NotPrevious(tmp2))    //if we haven't visited this state yet
							{
								AddState(tmp2, s, usedStates);   //add this state to be expanded on
							}

						}
					}
				}
			}
			if (best == null)
				Console.WriteLine("Solution not found");   //if we don't return by this point, there is no solution
			else
			{
				Console.WriteLine("Best: ");
				best.Solved();
			}
		}

		//runs a Breadth First Search to find the shortest path
		public static void BFSSolution(int num, int boatCap)
		{
			List<State> usedStates = new List<State>();

			State InitState = new State(num);

			Queue<State> q = new Queue<State>();    //queue for BFS
			AddState(InitState, q, usedStates);


			while (q.Count > 0)
			{
				State tmp = q.Peek();
				q.Dequeue();        //retreive top state
				tmp.PrintState();  //print it
				for (int i = 0; i <= boatCap; i++)
				{
					for (int j = 0; j <= boatCap - i; j++)      //run through all possible moves
					{
						bool move = tmp.ValidMove(i, j);       //ensure move is legal
						if (move)
						{
							int direction = -1 * tmp.BoatSide;
							int nlm = tmp.LM + (direction * i);
							int nlc = tmp.LC + (direction * j);
							//cout << i << " " << j << endl;
							State tmp2 = new State(num, nlm, nlc, -1 * tmp.BoatSide, tmp.numMoves + 1, tmp);    //build new state
							if (tmp2.Solved()) //check if this is the solution state
							{
								return; //stop
							}
							else if (tmp2.previousState.NotPrevious(tmp2))    //if we haven't visited this state yet
							{
								AddState(tmp2, q, usedStates);   //add this state to be expanded on
							}

						}
					}
				}
			}
			Console.WriteLine("Solution not found");   //if we don't return by this point, there is no solution
		}

		static void Main()
		{

			int bc = -1;
			int num = -1;
			while (num <= 0)
			{
				Console.WriteLine("Enter number of Missionaries and Cannibals (must be greater than 0)");
				num = int.Parse(Console.ReadLine());
			}
			while (bc <= 0)
			{
				Console.WriteLine("Enter capacity of the boat (must be greater than 0)");
				bc = int.Parse(Console.ReadLine());
			}
			int searchType = -1;
			while(searchType !=1 && searchType != 0)
			{
				Console.WriteLine("Enter 0 for a Breadth First Search(stops at first solution) or 1 for a Depth First Search (explores all options)");
				searchType = int.Parse(Console.ReadLine());
			}
			if(searchType ==  0)
				BFSSolution(num, bc);
			else
				DFSSolution(num, bc);

		}

	}





	




}
