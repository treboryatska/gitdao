import { AssetBalance, Client, DaoBalancesQueryParams, TokenVotingClient, TokenVotingMember, DaoDetails } from '@aragon/sdk-client';
import { context } from "../index";

// Instantiate the general purpose client from the Aragon OSx SDK context.
const client: Client = new Client(context);

// Address or ENS of the DAO whose metadata you want to retrieve.
//const daoAddressOrEns: string = "0xc432356f9f2da794dda3df10706ea34dc18a725d"; // ea.dao.eth
const daoAddressOrEns: string = "0x0d870e2ea982298d7756ac6aefe90271dabb80b5"; // gitdao testnet

async function getDaoDetails() {
	// Get a DAO's details.
	const dao: DaoDetails | null = await client.methods.getDao(daoAddressOrEns);
	console.log(dao);
}

// This function retrieves the address of a plugin installed in a DAO.
async function getPluginAddress(): Promise<string | null> {
    const dao: DaoDetails | null = await client.methods.getDao(daoAddressOrEns);
    const pluginId = 'token-voting.plugin.dao.eth'; // The id you're searching for
    const plugin = dao?.plugins.find(plugin => plugin.id === pluginId);
    if (plugin) {
        //console.log("Plugin address is: "+plugin.instanceAddress); // For debugging
        return plugin.instanceAddress;
    } else {
        console.log('Plugin not found.');
        return null;
    }
}

async function getDaoBalances() {
	// Get a DAO's Balances.
    const daoBalances: AssetBalance[] | null = await client.methods.getDaoBalances({daoAddressOrEns});
    console.log(daoBalances);
}

async function getMembers() {
    // Create a TokenVoting client
    const tokenVotingClient: TokenVotingClient = new TokenVotingClient(context);
    const pluginAddress: string = await getPluginAddress();
    //const pluginAddress: string = "0x1a760a06d0e430472cb1c6c58639200dcd15e8c2"; //  The address of the plugin that DAO has installed. You can find this by calling `getDao(daoAddress)` and getting the DAO details .
    const members: TokenVotingMember[] = await tokenVotingClient.methods.getMembers(
        { pluginAddress },
    );
    console.log(members);
}

//getDaoDetails();
//getDaoBalances();
getMembers();
//getPluginAddress();


