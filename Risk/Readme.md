# Risk Probability

Developed in C++

This is used to calculate the probability of any given event in the game Risk.  In Risk, the attacker can roll 1-3 dice and the defender
can roll 1-2 dice, but cannot roll more dice than the attacker.  Players then compare highest and 2nd highest die roll, if applicabe.  If
the defender's roll is greater than or equal to the attack of the defender's, the attacker loses an army.  If the attacker is greater than 
the defender, the attacker wins.

The probabilty of each possible event becomes cumbersome to calculate by hand, especially in the case of the attacker rolling 3 and defender
rolling 2 dice with its 6^5 possibilites to analyze.  This program allows the computer to do the work for me.
