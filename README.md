# gitdao

*WORK IN PROGRESS*

Gitdao allows contributors of a Git repository yo be the owners of the repository using a DAO.

GitDAO is a tool that calculates the contribution of each member of a Git repository based on the lines of code they have written with a weighted score. (for example, comments are worth half a point).

The goal is to use this tool to calculate the contribution of each member and give them a share of the DAO's tokens based on their contribution.

In the future a Github user could login the DAO dashboard using only their Github account using zklogin.

## How to use

Use with:

`python3 gitdao.py <path-to-a-git-repo>`

Output will be something like this:

```

Author                    Lines      Points     % of Total Points 
-----------------------------------------------------------------
Min                       4944       4691.00    12.97             
John                      28914      28847.50   79.75             
J3                        825        825.00     2.28              
leo                       71         71.00      0.20              
Léo3                      645        638.50     1.77              
Alejandro                 14         8.50       0.02              
dan                       29         29.00      0.08              
Idr                       1062       1062.00    2.94              
ZZ                        2          2.00       0.01     
```

The idea is that the DAO is the owner of the repository. The `% of total points` are the `%` of your ownership of the DAO.

This information will be refreshed every a certain period of time (for example, every month or every release) and the DAO will distribute the tokens to the contributors based on their contribution on the main branch.

## Weighted Points

The points are calculated as follows:

- 1 point for each line of code
- 0.5 points for each line of commented code or line in a text file (txt and md files)

# Steps to create a repository an give its ownership to a DAO

1. Create a Github account for the DAO
2. Create a repository or transfer an existing one to the DAO account
3. Manage access with a multisig wallet so the DAO controls the Github account. For this we need to create a [Safe](https://safe.global).
When creating the safe you will need to configure 2 important things:
    - The threshold: the number of signatures required to execute a transaction
    - The owners: the addresses that will be able to sign transactions

![alt text](image.png)

One created you should see something like this:

![alt text](image-1.png)

4. Create a Secure document that will contain the Github account's login, credentials, recovery coes and any other revelant information.

5. Encrypt this document with GPG or another tool and upload it to IPFS, any other shared location or even the Github repositor itself. Share the location with the DAO members.

6. Whenever access to the GitHub account is needed (for example, to update credentials or to perform critical actions), a proposal is created within the DAO's governance platform, specifying the reason for access.

7. If the DAO members approve the proposal, the required number of multisig wallet owners will provide their signatures. This could be a formal transaction or a less formal agreement, depending on the DAO's practices and the multisig wallet's capabilities.

8.  Once the proposal is approved, the decryption key is shared with the approved members through a secure communication channel.

9. The approved members use the credentials to log into the GitHub account and perform the necessary actions. All actions should be documented and transparent to the DAO members.

10. After the action is completed, consider resetting the GitHub account's credentials and updating the secure document with the new encrypted information. This ensures that access is tightly controlled and that credentials are not overexposed.

11. Automate Repository Actions Based on DAO Proposals: To truly integrate the DAO's governance model with repository management, you can automate certain actions (like merging PRs, changing access permissions, etc.) based on the outcomes of DAO proposals. This would require setting up a bot or service that listens to events from the Aragon DAO and interacts with the GitHub API to perform actions on the repository.

    * Set Up a Server or Service: Deploy a server or service that listens for finalized proposals from your Aragon DAO. This can be done by interacting with the Aragon smart contracts or using Aragon's API if available.
    * Interact with GitHub API: Upon detecting a passed proposal relevant to GitHub repository management, the server would use the GitHub API to perform the specified actions. This requires the server to authenticate with GitHub using the DAO's GitHub account credentials (stored securely, potentially accessed via a multisig wallet).
