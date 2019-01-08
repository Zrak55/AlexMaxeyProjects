//Alexander Maxey
//Lexicon/Word Tree
//Uses a tree to represent a collection of words inputted by the user
//Developed in Dev-C++ in the c++ language


#include <iostream>
#include <fstream>
#include <stdlib.h>

using namespace std;
struct TreeNode
{
	char val;
    bool endWord;
    TreeNode *next[26];
};

typedef TreeNode *TreeNodePtr;

void insert(const string str, TreeNodePtr &root);
bool isWord(const string str,  const TreeNodePtr root);
bool isPrefix(const string pre,  const TreeNodePtr root);
void print(const string str, const TreeNodePtr root);
int wordCount(const TreeNodePtr root);
void initNewNode(TreeNodePtr &node, int letter);
void menu(TreeNodePtr & root);
void deleteWord(TreeNodePtr &root, const string str);
void loadFromFile(TreeNodePtr root);

int main()
{
	
	TreeNodePtr root;
	initNewNode(root, -65); //this makes the character a space.  It is a junk value and all words begin from the array in this node
	menu(root);
	return 0;
}



//void insert
//inserts the given string into the lexicon
//new nodes are created as needed
//recursion is used to accomplish this
//pre: str is all lowercase letters
//post: the given word is added to the lexicon
void insert(const string str, TreeNodePtr &root) {
    if (str.length() == 0) {
        //do nothing, empty string.  Safeguard against user errors
    } else if (str.length() == 1) //base case
    {
        if (root->next[str[0] - 'a'] == NULL) {
            initNewNode(root->next[str[0] - 'a'], int(str[0] - 'a'));
            root->next[str[0]-'a']->endWord=true;
            //if the needed index doesn't exist, make a new one with the proper character and endWord as true
        } else {
            root->next[str[0] - 'a']->endWord = true; //if it does exist, make sure the endWord is true
        }
    } else //length is greater than 0
    {
        if (root->next[str[0] - 'a'] == NULL) {
            initNewNode(root->next[str[0] - 'a'], str[0] - 'a');
            //if the needed traversal index doesn't exist, create it with the proper character and endWord as false
        }
        insert(str.substr(1), root->next[str[0] - 'a']); //recursively insert, subtracting the first character from str
    }

}

//bool isWord
//pre: str is all lowercase
//post: returns true if the word is in the lexicon, false otherwise
bool isWord(const string str, const TreeNodePtr root) {
    if (str.length() == 0) //ensures that an empty string is handled
    {
        return false;
    } else if (str.length() == 1) //base case
    {
        if (root->next[str[0] - 'a'] == NULL) {
            return false; //if the needed final character doesn't exist, the word doesn't exist
        } else {
            return root->next[str[0] - 'a']->endWord; //if it does, it must be an endword
        }
    } else {
        if (root->next[str[0] - 'a'] == NULL) {
            return false; //if the next character doesn't exist, the word doesn't exist
        } else {
            return isWord(str.substr(1), root->next[str[0] - 'a']); //recursively check the next characters
        }
    }
}

//bool isPrefix
//similar to isWord, but does not require the given string to be an endWord
//pre: pre is a string with all lowercase letters
//post: returns true if the prefix exists within the lexicon, false if it does not
bool isPrefix(const string pre, const TreeNodePtr root) {
    if (pre.length() == 0) //handles empty string
    {
        return true;
    } else if (pre.length() == 1)//base case
    {
        return root->next[pre[0] - 'a'] != NULL; //if the needed final character exists, then isPrefix is true
    } else {
        if (root->next[pre[0] - 'a'] == NULL) {
            return false; //make sure the needed character exists
        } else {
            return isPrefix(pre.substr(1), root->next[pre[0] - 'a']); //recursively check the next characters
        }
    }
}

//void print
//prints out all of the words in the lexicon
//the input is the collection of charactes up until the current iteration of the method
//Uses Recursion
//pre: str is all lowercase letters, the original input is a blank string
//post: prints out all words in the lexicon alphabetically, one on each line
void print(const string str, const TreeNodePtr root) {
    string str1 = str + root->val; //temp string, adds in characters
    if (str1 == " ") {
        str1 = ""; //base case, eliminates the initial character from the "characterless" root
    }
    if (root->endWord)//If this is an end word, print out the needed string
    {
        cout << str1 << endl;
    }
    for (int i = 0; i < 26; i++) //go through each pointer
    {
        if (root->next[i] != NULL) {
            print(str1, root->next[i]); //if the pointer exists, recursively print that treeNode
        }
    }
}


//int wordCount
//pre: none
//post: returns the number of words in the Lexicon
int wordCount(const TreeNodePtr root) {
    int num = 0;
    if (root->endWord) {
        num++;
    } //checks if the current node is an endword
    for (int i = 0; i < 26; i++) {
        if (root->next[i] != NULL) {
            num += wordCount(root->next[i]); //recursively check each pointer for the number of words
        }
    }//if the pointer is null, the letter doesn't exist and will be skipped
    return num;//returns the number of words
}

//void initnewNode
//pre: letter is an int value 0-25, with 0 representing a and 25 representing z
//post: node is created and ready for use
void initNewNode(TreeNodePtr &node, int letter)
{
	node = new TreeNode;
	for(int i=0; i<26; i++)
	{
		node->next[i]=NULL;
	}
	node->endWord=false;
	node->val= letter + 'a';
}

//void menu
//uses a root node to do all functions of the class
void menu(TreeNodePtr & root)
{
	int i =0;
	while(i==0)
	{
		cout<<"Welcome to the Word Tree Lexicon"<<endl;
		cout<<"================================"<<endl;
		cout<<"1: Load a set of words from a file"<<endl;
		cout<<"2: Insert a word"<<endl;
		cout<<"3: Delete a word"<<endl;
		cout<<"4: Check if a word is in the lexicon"<<endl;
		cout<<"5: Check if a word is a prefix int the lexicon"<<endl;
		cout<<"6: Show the number of words in the lexicon"<<endl;
		cout<<"7: Print all words in the Lexicon"<<endl;
		
		int x;
		cin >> x;
		switch(x)
		{
			case 1:
				{
					loadFromFile(root);
					break;
				}
			case 2:
				{
					string y;
					cout<<"Enter word to insert (LOWERCASE ONLY!!)"<<endl;
					cin >> y;
					insert(y, root);
					break;
				}
			case 3:
				{
					cout<<"Enter word to delete (LOWERCASE ONLY!!)"<<endl;
					string y;
					cin >> y;
					deleteWord(root, y);
					break;
				}
			case 4:
				{
					string y;
					cout<<"Enter word to search for (LOWERCASE ONLY!!)"<<endl;
					cin >> y;
					cout<<y <<" is ";
					if(!isWord(y, root))
					{
						cout<<"NOT ";
					}
					cout<<"a word in the tree"<<endl;
					break;
				}
			case 5:
				{
					string y;
					cout<<"Enter what to search for (LOWERCASE ONLY!!)"<<endl;
					cin >> y;
					cout<<y <<" is ";
					if(!isPrefix(y, root))
					{
						cout<<"NOT ";
					}
					cout<<"a prefix in the tree"<<endl;
					break;
				}
			case 6:
				{
					int v = wordCount(root);
					cout<<"There ";
					if(v==1)
					{
						cout<<"is ";
					}
					else
					{
						cout<<"are ";
					}
					cout<<v<<" word";
					if(v!=1)
					{
						cout<<"s";
					}
					cout<<" in the tree"<<endl;
					break;
				}
			case 7:
				{
					string y = "";
					print(y, root);
					break;
				}
			default:
				{
					cout<<"Invalid Input"<<endl;
					break;
				}
		}
		cout<<"Continue working with lexicon?\n0:yes \n1:no"<<endl;
		cin>>i;
		for(int i =0; i<25; i++)
		{
			cout<<"\n"<<endl;
		}
	}
	cout<<"Thanks for using the Lexicon!"<<endl;
}

//void deleteWord
//deletes a word from the tree by simply changing the status of endWord
//if the word did not exist in the first place no change is made
//pre: str is all lowercase
//post: str is not in the tree
void deleteWord(TreeNodePtr &root, const string str)
{
	if(str.length()==0)
	{
		return;
	}
	else if(root->next[str[0]-'a']!=NULL)
	{
		if(str.length()==1)
		{
			root->next[str[0]-'a']->endWord=false;
		}
		else
		{
			deleteWord(root->next[str[0]-'a'], str.substr(1));
		}
	}
	
}

//void loadFromFile
//gets user inputted file to insert into the tree
//pre: root is the base of the tree
//post: the file is loaded into the tree
void loadFromFile(TreeNodePtr root)
{
	ifstream infile;
	cout<<"Enter file name"<<endl;
	cout<<"Ensure your file has the same directory as this program, ends in \".txt\", has one word per line, all words are lowercase, and ends in ENDFILE"<<endl;
	string x;
	cin >> x;
	infile.open("x"); //open our file
	if (!infile)
	{
		cerr << "Unable to open the file !!";
		exit(1); // END THE PROGRAM
	}
	string input;
	while(input!="ENDFILE")
	{
		insert(input, root);
	}
	infile.close(); //close the file
}
