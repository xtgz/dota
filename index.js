const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');

async function main() {
    const provider = new WsProvider('');
    const api = await ApiPromise.create({ provider });
    const keyring = new Keyring({ type: 'sr25519' });
    const sender = keyring.addFromMnemonic('');
    const recipient = sender.address;
    const initialAmount = 0;
    const remarkData = '{"p":"dot-20","op":"mint","tick":"DOTA"}';

    const sendTransaction = async () => {
        try {
            const transferKeepAliveCall = api.tx.balances.transferKeepAlive(recipient, 0);
            const remarkCall = api.tx.system.remark(remarkData);
            const batchAllCall = api.tx.utility.batchAll([transferKeepAliveCall, remarkCall]);

            const hash = await batchAllCall.signAndSend(sender);
            console.log(`交易成功发送，交易哈希: ${hash}`);
        } catch (error) {
            console.error(`交易在发送时出错:`, error);
        } finally {
            setTimeout(sendTransaction, 6000);
        }
    };

    await sendTransaction();
}

main().catch(console.error);

