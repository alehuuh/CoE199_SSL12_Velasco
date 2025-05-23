from web3.auto import w3
with open("C:/AlejaThesis/Blockchain/node1/data/keystore/UTC--2025-02-04T03-35-51.575507500Z--f0c0ba7bcbf04a504b3744bc57e725d6240cb9c5") as keyfile:
    encrypted_key = keyfile.read()
    private_key = w3.eth.account.decrypt(encrypted_key, '123456')

import binascii
print("this is your Ethereum private key : ")
print(binascii.b2a_hex(private_key))