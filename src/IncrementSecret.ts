import {
    Field, // base type in SnarkyJS
    SmartContract, // class that creates smart contracts
    state, // convenience decorator referencing state stored on chain in a zkApp account
    State, // class used to create state stored on Chain
    method, // convenience decorator that creates smart contract methods
    Poseidon
} from 'snarkyjs';

export class IncrementSecret extends SmartContract { // creates a new smart contract called IncrementSecret
    @state(Field) x = State<Field>(); // create one element of on-chain state named x of type Field

// the following is intended to run only once to set up the initial state of the zkApp account
// The values for "salt" and secret are private 
    @method initState(salt: Field, firstSecret: Field) {
        this.x.set(Poseidon.hash([ salt, firstSecret])); // set up intital state of smart contract on deployment as well as initialize on-chain state x to results of Poseidon.hash([ salt, firstSecret])
    }

// Poseidon hash function takes an array of Fields and returns a single Field output
// Poseidon hash function was designed to be used inside zero knowledge proof system and is fast


// this method updates the state
    @method incrementSecret(salt: Field, secret: Field) {
        const x = this.x.get();
        this.x.assertEquals(x);

        Poseidon.hash([salt, secret]).assertEquals(x);
        this.x.set(Poseidon.hash([salt, secret.add(1)]));
    }
}
