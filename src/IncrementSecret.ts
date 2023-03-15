import {
    Field,
    SmartContract,
    state,
    State, 
    method,
    Poseidon
} from 'snarkyjs';

export class IncrementSecret extends SmartContract {
    @state(Field) x = State<Field>();
}

@method initState(salt: Field, firstSecret: Field) {
    this.x.set(Poseidon.hash([ salt, firstSecret]));
}

@method incrementSalt(salt: Field, secret: Field) {
    const x = this.x.get();
    this.x.assertEquals(x);

    Poseidon.hash([salt, secret]).assertEquals(x);
    this.x.set(Poseiden.hash([salt, secret.add(1)]));
}
