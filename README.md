# gitdao

*WORK IN PROGRESS - EARLY ALPHA STAGE - If you like the concept feel free to get in contact*  

Gitdao allows contributors of a Git repository to be the owners of the repository using a DAO.

The goal is to extend this functionality so the the DAO can control all aspects of an open source project, including the repository, the website, the social media accounts, the domain, the CI/CD, the funding, the governance, etc.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [GitDAO's Mission](#gitdaos-mission)
- [Why GitDAO?](#why-gitdao)
- [First proof of concept](#first-proof-of-concept)
- [Architecture designs](#architecture-designs)
- [Components](#components)
  - [1. CPC](#1-cpc)
    - [How to use CPC](#how-to-use-cpc)
    - [Weighted Points](#weighted-points)
  - [2. CFR (Configuration File Reader)](#2-cfr-configuration-file-reader)
    - [2.1 CFR - Check 1 - Complete git history](#21-cfr---check-1---complete-git-history)
    - [2.2 CFR - Check 2 - Verify ownership](#22-cfr---check-2---verify-ownership)
  - [3. PAC (Points Adjustment Calculator)](#3-pac-points-adjustment-calculator)
  - [4. Steps to create a repository and give its ownership to a DAO](#4-steps-to-create-a-repository-and-give-its-ownership-to-a-dao)
- [Notes](#notes)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## GitDAO's Mission

Create the necessary tools so any project can easily create any governance model they see fit.

Decentralize the governance of FOSS projects.

## Why GitDAO?

FOSS projects require some sort of governance. Even with open source code, someone has to decide what features to approve, what pull requests to merge, etc. Historically if a large enough group of contributors disagreed with the original founder, they would fork the project and create a new one.

Today many FOSS (free and open source software) projects are controlled by the original founders.

So even thought the source code is open, the governance of the project is not. This can be a problem.

I believe governance of a FOSS project should be able to be more dynamic. It should evolve naturally and seemslessly with the project as people come and go.

FOSS projects have:

* Assets: The code, the website, the domain, the social media accounts, the funds, etc.
* Management: The governance of the project. Who can merge pull requests, who can approve features, who can decide what to do with the funds, etc.

The assets are controlled by management. This management can be done by the project founders at the beginning but as the project evolves this control may or may not need to change.

We should also **have the option to be able to split the management of the project between the founders, contributors, owners or even users in whatever way they see fit**. There is no easy way to do this today.

This couldn't be done before because the technology to do this didn't exist. To be fair, we may still not have all the pieces to do this but we are getting closer.

## First proof of concept

We are starting with a simple governance model.

**Assets of the FOSS project to manage**: A git repository.

**Governance model**: The effective control of the assets (in this case, just a repository) is given to the contributors of the project in the proportion of their contributions. 

## Architecture designs

Initial creation of the gitdao:

```mermaid
graph TD;
    FE(Front End Form or API)
    Q1{New git Repo?}
    NRWF[New Repo Web form]
    ARC[["ARC <br> (Automatic Repo Creator)"]]
    ADC[["ADC <br> (Automatic DAO Creator)"]]
    M3P[Manual 3rd parties ownership transfer]
    FE[Front End Form or API] --> Q1
    Q1 -->|Yes| NRWF
    Q1 -->|No| ARC
    ARC -->|API| ADC
    NRWF -->|API| ADC
    ADC --> M3P
```


Recalculation of the ownership of the project ([link to edit](https://mermaid.live/edit#pako:eNp1Uk1vgzAM_StWdm136a2bOiHQpB3aVbRSNUEPKTGFDRKUD1UT7X9fEqBlU8eBOM_P9rPjlmSCIZmTo6RNAdvoKeVgv6Bd4QlibMTLpUNW8e41GUDY4QFyIet9T4_DJDBa1FSXWccIJVItJEydc6BFY1oUvI9Z0cBaztbJknJDK5hJBg2VukQF4sRRqqJsQEvKVY5yyArT6eL8gersRY7BlTi78leRHgzWb2dX7tbXHdgaDnViUt5B4TpMQsG1LA_GaV6LkmsFIa0yU_kung9yYbunTMEjo2JEVvtrDl9skxXITIUMYsOt8DAsKD-i6ln9re3Py2_42prNdsfjJ-HFBezTKF0j1zeRXcC_7sR74Ob6299wtcUeQOSgxRdyZQ-obeDez8wa_VNaK3E_cJvTUfd-rtv-DTvecEsGY8wnE1KjrGnJ7J62LiAlusAaUzK3JsOcmkqnJOUXS6V23JtvnpG5lgYnxDTMio1Kaje8JvOcVgovP9ja-RY)):

```mermaid
graph TD;
    ENDCPC("End CPC")
    CFR[["CFR (Configuration File Reader)"]]
    CPC[["CPC<br>(Contributor Points Calculator)"]]
    CChanges{Changes?}
    daoContributors>"daoContributors.txt"]

    CFR --> CChanges
    CChanges -->|No| ENDCPC
    CChanges -->|Yes| PAC
    PAC[[" PAC <br>(Points Adjustment Calculator)<br>calculates # of tokens to mint"]]--> Mint
    Mint[Mint New tokens] --> Transfer
    Transfer[Transfer New tokens] --> ENDCPC
    CPC -->|Scheduled Runs| CFR
    CFR -->|Verifies| daoContributors
```

New contributors and therefore owner will come over the repository, so we need a way for Github users to link there public keys to that user. For this we would have to create a `daoContributors.txt` file in the root of the repository. This file will have a content like:

```
Min 0x327a12059118e599059f432f238B54090c5bDC2D
Idr 0x2574806fD47E49A53dC2bB0b5f5c12Ecb445CDa4
```

Note1: We will have to look at all git history of this file, not just the last version of it, to avoid someone adding their public key and then removing it. Also tokens can be transferred between users. So CPC will check the balance of all address linked to that user. (*pending to improve*)

Note2: When `daoContributions.txt` is read it should only consider an address of a user if it was written by the same user. This is to avoid someone adding someone else's address to the file.

## Components

### 1. CPC

GitDAO's CPC (Contributor's Points Calculator) is a tool that calculates the contribution of each member of a Git repository based on the lines of code they have written with a weighted score. (for example, comments are worth half a point).

The goal of the CPC is to to calculate the contribution of each member to later give them a share of the DAO's tokens based on their contribution.

In the future a Github user could login the DAO dashboard using only their Github account using zklogin.


#### How to use CPC

Use with:

`python3 cpc.py <path-to-a-git-repo>`

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

Author                    Address               % of Total Points  % of Claimed Points
-----------------------------------------------------------------------------------------------------
leo          0x327a12059118e599059f432f238B54090c5bDC2D 0.20               97.26             
ZZ           0x2574806fD47E49A53dC2bB0b5f5c12Ecb445CDa4 0.01               2.74   
```

The idea is that the DAO is the owner of the repository. The `% of total points` are the `%` of your ownership of the DAO.

This information will be refreshed every a certain period of time (for example, every month or every release) and the DAO will distribute the tokens to the contributors based on their contribution on the main branch.

#### Weighted Points

The formulta to calcute the points can be improved and is up for debate, but for now the points are calculated as follows:

- 1 point for each line of code
- 0.5 points for each line of commented code or line in a text file (txt and md files)

Ideally one day the weight of the points will be decided by the DAO members.

### 2. CFR (Configuration File Reader)

`daoContributors.txt` contains the list of contributors and their public keys. However this file cannot be read directly and has to be verified each time before use. This verification will:

- Read the Complete git history of the `daoContributors.txt` file
- Only consider an address of a user if it was written by the same user. If not ignore it.

#### 2.1 CFR - Check 1 - Complete git history

We will have to look at all git history of this file, not just the last version of it, to avoid someone adding their public key and then removing it. Also tokens can be transferred between users (*pending to improve*).

We have the script [cfr.sh](cfr.sh) that will give us the full history of of the `daoContributors.txt` file in a git repository.

So if your file today has:

```
Min 0x327a12059118e599059f432f238B54090c5bDC2D
Idr 0x2574806fD47E49A53dC2bB0b5f5c12Ecb445CDa4
```

But used to have:
```
Min 0x89c183cefd4cDc18525dF9ECaa82Cdac9C014271
```

The `cfr.sh` will give you the following:
```
Min 0x327a12059118e599059f432f238B54090c5bDC2D
Min 0x89c183cefd4cDc18525dF9ECaa82Cdac9C014271
Idr 0x2574806fD47E49A53dC2bB0b5f5c12Ecb445CDa4
```

#### 2.2 CFR - Check 2 - Verify ownership

When `daoContributors.txt` is read it should only consider an address of a user if it was written by the same user. This is to avoid someone adding someone else's address to the file.


### 3. PAC (Points Adjustment Calculator)

GitDAO's PAC (Points Adjustment Calculator) is the tool that calculates the number of tokens to mint based on the CPC's output and the previously minted tokens.

Example: A DAO has 100 tokens and two owners, Bob with 40 tokens (40%) and Alice with 60 tokens (60%). Next time CPC is run, it calculates that Bob should have 45% of the points and Alice 55%, so PAC has to make the necessary adjustments to change the ownership of the DAO.

To adjust the ownership percentages in the DAO to 45% for Bob and 55% for Alice, we need to calculate the number of new tokens to mint and how many of those tokens should go to each owner.

Let's define:
- $T$ as the total current tokens in the DAO, which in this example is 100.
- $T_{new}$ as the total new tokens to be minted. We want to calculate this value.
- $T_{total}$ as the total number of tokens after minting the new tokens, which is the sum of the current tokens and the new tokens.
- $Uc_{i}$ as the current number of tokens user i owns. In this example, $U_{current}$ is 40 for Bob and 60 for Alice.
- $Ue_{i}$ as the extra tokens to be given to User i. We want to calculate this value.

We aim for Bob to own 45% of the total tokens and Alice to own 55% after minting the new tokens. We can express this as the following equations:

Bob's new ownership percentage:
$$\frac{B_{current} + B_{extra}}{T + T_{new}} = 0.45$$

Alice's new ownership percentage:
$$\frac{A_{current} + A_{extra}}{T + T_{new}} = 0.55$$

Since the total number of new tokens $T_{new}$ is the sum of the extra tokens given to all users, in this case, Bob and Alice:

$$T_{new} =\sum_{i=1}^n Ue_{i}$$
$$T_{new} = B_{extra} + A_{extra}$$

We can solve these equations to find the values of $B_{extra}$, $A_{extra}$, and $T_{new}$.

To adjust the ownership percentages in the DAO to 45% for Bob and 55% for Alice by minting new tokens, we should mint a total of 33.33 new tokens, having a new total of 133.33 tokens. Distribute 20 of these new tokens to Bob, giving him a total of 60 tokens, which will be 45% of the new total. The remaining 13.33 new tokens should be distributed to Alice, giving her a total of 73.33 tokens, which will be 55% of the new total.

### 4. Steps to create a repository and give its ownership to a DAO

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

5. Encrypt this document with GPG or another tool and upload it to IPFS, any other shared location or even the Github repository itself. Share the location with the DAO members.

6. Whenever access to the GitHub account is needed (for example, to update credentials or to perform critical actions), a proposal is created within the DAO's governance platform, specifying the reason for access.

7. If the DAO members approve the proposal, the required number of multisig wallet owners will provide their signatures. This could be a formal transaction or a less formal agreement, depending on the DAO's practices and the multisig wallet's capabilities.

8.  Once the proposal is approved, the decryption key is shared with the approved members through a secure communication channel.

9. The approved members use the credentials to log into the GitHub account and perform the necessary actions. All actions should be documented and transparent to the DAO members.

10. After the action is completed, consider resetting the GitHub account's credentials and updating the secure document with the new encrypted information. This ensures that access is tightly controlled and that credentials are not overexposed.

11. Automate Repository Actions Based on DAO Proposals: To truly integrate the DAO's governance model with repository management, you can automate certain actions (like merging PRs, changing access permissions, etc.) based on the outcomes of DAO proposals. This would require setting up a bot or service that listens to events from the Aragon DAO and interacts with the GitHub API to perform actions on the repository.

    * Set Up a Server or Service: Deploy a server or service that listens for finalized proposals from your Aragon DAO. This can be done by interacting with the Aragon smart contracts or using Aragon's API if available.
    * Interact with GitHub API: Upon detecting a passed proposal relevant to GitHub repository management, the server would use the GitHub API to perform the specified actions. This requires the server to authenticate with GitHub using the DAO's GitHub account credentials (stored securely, potentially accessed via a multisig wallet).

## Notes

**DAO's email address:** The DAO will need an email address to create the Github account among other things. This email address should be controlled by the DAO. It' still up to debate which is the best way to do this.

**Contributions give you the initial mint rights of the DAO**, but not its continuence. This means that if today you made 10% of the contributions points, you will get 10% of the DAO's tokens. Once they are minted at your address, there is no further control over them. So, if you transfer them to someone else, you will effectively transfer the ownership of the DAO and the only way to recover them is if someone transfer you back the tokens. This is a feature, not a bug. Example: You have 1000 tokens that represent 10% of the DAO and you transfer 300 tokens to someone else. Let's say that in the next recalculation you made more contributions and you are entitled to 1200 total tokens. In this case the system will only transfer you 200.