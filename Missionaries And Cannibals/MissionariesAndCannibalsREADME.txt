Missionaries and Cannibals README
The associated code is meant to tackle the classic problem of Missionaries and Cannibals.  The basis of the problem is you have an equal number of missionaries and cannibals on one side of a river with a boat that can
only hold a certain number of people.  If the Cannibals ever outnumber the missionaries on any side of the river or on the boat itself, they will eat the missionaries.  You must decide how to cross the river without
anyone being eaten.  
This was a fun exercise in working with states and finite state automata.  As for the problem itself, it is always solvable if the boat can hold at least 4 people, the strategy being to ferry 2 of each across, and bring 1 of each 
back, so a balance will always be maintained.  There may be faster solutions out there, which this program does find, but that is always the most reliable method.  It was a fun exercise getting the computer to both read a state and 
recognize if a state had been reached before, because if a state has been reached before in a certain decision making path, you have entered a loop and that solution is no longer valid.  The program was written in C++ with the DevC++
IDE.
