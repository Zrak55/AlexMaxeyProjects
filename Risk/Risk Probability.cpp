#include <iostream>
#include <fstream>
#include <stdlib.h>
#include <iomanip>
#include <ctime>

using namespace std;

int attackerDice1[1];
int attackerDice2[2];
int attackerDice3[3];
int defenderDice1[1];
int defenderDice2[2];

int aw = 0;
int dw = 0;

int split = 0;
int ak1 = 0;
int ak2 = 0;
int dk1 = 0;
int dk2 = 0;

int total = 0;

int findMax(int vals[], int size);


int main()
{
	
	//1 v 1
	for(int i =6; i>0; i--)
	{
		for(int j = 6; j>0; j--)
		{
			attackerDice1[0]=i;
			defenderDice1[0]=j;
			for(int num = 0; num<1; num++)
			{
				int aM = findMax(attackerDice1, 1);
				int dM = findMax(defenderDice1, 1);
				if(aM>dM)
				{
					aw++;
				}
				else
				{
					dw++;
				}
			
			}
			if(aw==dw)
			{
				split++;
			}
			else if(aw==1)
			{
				ak1++;
			}
			else if(aw==2)
			{
				ak2++;
			}
			else if(dw==1)
			{
				dk1++;
			}
			else if(dw==2)
			{
				dk2++;
			}
			aw=0;
			dw=0;
		}
	}
	total = 6*6;
	cout<<"Attacker 1 die, Defender 1 die"<<endl;
	cout<<"Attacker kills 1: "<<ak1<<"/"<<total<<endl;
	cout<<"Attacker kills 2: "<<ak2<<"/"<<total<<endl;
	cout<<"Defender kills 1: "<<dk1<<"/"<<total<<endl;
	cout<<"Defender kills 2: "<<dk2<<"/"<<total<<endl;
	cout<<"1 kill each: "<<split<<"/"<<total<<endl;
	cout<<"\n"<<endl;
	split = 0;
	ak1 = 0;
	ak2 = 0;
	dk1 = 0;
	dk2 = 0;
	
	
	//2 v 1
	for(int i =6; i>0; i--)
	{
		for(int k = 6; k>0; k--)
		{
		for(int j = 6; j>0; j--)
		{
			attackerDice2[0]=i;
			attackerDice2[1] = k;
			defenderDice1[0]=j;
			for(int num = 0; num<1; num++)
			{
				int aM = findMax(attackerDice2, 2);
				int dM = findMax(defenderDice1, 1);
				if(aM>dM)
				{
					aw++;
				}
				else
				{
					dw++;
				}
			
			}
			if(aw==dw)
			{
				split++;
			}
			else if(aw==1)
			{
				ak1++;
			}
			else if(aw==2)
			{
				ak2++;
			}
			else if(dw==1)
			{
				dk1++;
			}
			else if(dw==2)
			{
				dk2++;
			}
			aw=0;
			dw=0;
		}
		}
	}
	total = 6*6*6;
	cout<<"Attacker 2 die, Defender 1 die"<<endl;
	cout<<"Attacker kills 1: "<<ak1<<"/"<<total<<endl;
	cout<<"Attacker kills 2: "<<ak2<<"/"<<total<<endl;
	cout<<"Defender kills 1: "<<dk1<<"/"<<total<<endl;
	cout<<"Defender kills 2: "<<dk2<<"/"<<total<<endl;
	cout<<"1 kill each: "<<split<<"/"<<total<<endl;
	cout<<"\n"<<endl;
	split = 0;
	ak1 = 0;
	ak2 = 0;
	dk1 = 0;
	dk2 = 0;
	
	
	//3 v 1
	for(int i =6; i>0; i--)
	{
		for(int z = 6; z>0; z--)
		{
		for(int k = 6; k>0; k--)
		{
		for(int j = 6; j>0; j--)
		{
			attackerDice3[0]=i;
			attackerDice3[1] = k;
			attackerDice3[2] = z;
			defenderDice1[0]=j;
			for(int num = 0; num<1; num++)
			{
				int aM = findMax(attackerDice3, 3);
				int dM = findMax(defenderDice1, 1);
				if(aM>dM)
				{
					aw++;
				}
				else
				{
					dw++;
				}
			
			}
			if(aw==dw)
			{
				split++;
			}
			else if(aw==1)
			{
				ak1++;
			}
			else if(aw==2)
			{
				ak2++;
			}
			else if(dw==1)
			{
				dk1++;
			}
			else if(dw==2)
			{
				dk2++;
			}
			aw=0;
			dw=0;
		}
		}
		}
	}
	total = 6*6*6*6;
	cout<<"Attacker 3 die, Defender 1 die"<<endl;
	cout<<"Attacker kills 1: "<<ak1<<"/"<<total<<endl;
	cout<<"Attacker kills 2: "<<ak2<<"/"<<total<<endl;
	cout<<"Defender kills 1: "<<dk1<<"/"<<total<<endl;
	cout<<"Defender kills 2: "<<dk2<<"/"<<total<<endl;
	cout<<"1 kill each: "<<split<<"/"<<total<<endl;
	cout<<"\n"<<endl;
	split = 0;
	ak1 = 0;
	ak2 = 0;
	dk1 = 0;
	dk2 = 0;
	
	//2v2
	for(int i =6; i>0; i--)
	{
		for(int z = 6; z>0; z--)
		{
		for(int k = 6; k>0; k--)
		{
		for(int j = 6; j>0; j--)
		{
			attackerDice2[0]=i;
			attackerDice2[1] = k;
			defenderDice2[0] = z;
			defenderDice2[1]=j;
			for(int num = 0; num<2; num++)
			{
				int aM = findMax(attackerDice2, 2);
				int dM = findMax(defenderDice2, 2);
				if(aM>dM)
				{
					aw++;
				}
				else
				{
					dw++;
				}
			
			}
			if(aw==dw)
			{
				split++;
			}
			else if(aw==1)
			{
				ak1++;
			}
			else if(aw==2)
			{
				ak2++;
			}
			else if(dw==1)
			{
				dk1++;
			}
			else if(dw==2)
			{
				dk2++;
			}
			aw=0;
			dw=0;
		}
		}
		}
	}
	total = 6*6*6*6;
	cout<<"Attacker 2 die, Defender 2 die"<<endl;
	cout<<"Attacker kills 1: "<<ak1<<"/"<<total<<endl;
	cout<<"Attacker kills 2: "<<ak2<<"/"<<total<<endl;
	cout<<"Defender kills 1: "<<dk1<<"/"<<total<<endl;
	cout<<"Defender kills 2: "<<dk2<<"/"<<total<<endl;
	cout<<"1 kill each: "<<split<<"/"<<total<<endl;
	cout<<"\n"<<endl;
	split = 0;
	ak1 = 0;
	ak2 = 0;
	dk1 = 0;
	dk2 = 0;
	
	
	
	//3v2
	for(int i =6; i>0; i--)
	{
		for(int y = 6; y>0; y--)
		{
		for(int z = 6; z>0; z--)
		{
		for(int k = 6; k>0; k--)
		{
		for(int j = 6; j>0; j--)
		{
			attackerDice3[0]=i;
			attackerDice3[1] = k;
			attackerDice3[3] = y;
			defenderDice2[0] = z;
			defenderDice2[1]=j;
			for(int num = 0; num<2; num++)
			{
				int aM = findMax(attackerDice3, 3);
				int dM = findMax(defenderDice2, 2);
				if(aM>dM)
				{
					aw++;
				}
				else
				{
					dw++;
				}
			
			}
			
			if(aw==2)
			{
				ak2++;
			}
			else if(dw==2)
			{
				dk2++;
			}
			else if(aw==dw)
			{
				split++;
			}
			aw=0;
			dw=0;
		}
		}
		}
		}
	}
	total = 6*6*6*6*6;
	cout<<"Attacker 3 die, Defender 2 die"<<endl;
	cout<<"Attacker kills 1: "<<ak1<<"/"<<total<<endl;
	cout<<"Attacker kills 2: "<<ak2<<"/"<<total<<endl;
	cout<<"Defender kills 1: "<<dk1<<"/"<<total<<endl;
	cout<<"Defender kills 2: "<<dk2<<"/"<<total<<endl;
	cout<<"1 kill each: "<<split<<"/"<<total<<endl;
	cout<<"\n"<<endl;
	split = 0;
	ak1 = 0;
	ak2 = 0;
	dk1 = 0;
	dk2 = 0;
	
	return 0;
}


int findMax(int vals[], int size)
{
	int ret = 0;
	int loc = -1;
	for(int i=0; i<size; i++)
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

