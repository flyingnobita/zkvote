pragma circom 2.0.6;

include "../../../node_modules/circomlib/circuits/poseidon.circom";

// This circuit is used by the prover to prove that he knows a private input `password` that when hashed, matches with one of the passwordHashed.
// If password is correct (defined in Checkpassword_input.json), a witness is generated.
// If password is incorrect, an error will occured.
// Note: the Verifier can manipulate the set of passwordHashed given to the prover to deduce the password that the Prover has.
// e.g. For set of 2 passwordHashed, given Hashed(a) = A, Hashed(b) = B. The verifier can give A and C to prover. If prover successfully generate a witness and a proof, then verifier knows that the prover must possess `a`. If the prover fails at generating a witness, then the verifier knows that the prover must posses `b`.
// Thus there needs to be some proof that prover can rely on which states that the hashes given are all valid
template CheckPassword() {
  // public
  signal input passwordHashed1;
  signal input passwordHashed2;
  signal input passwordHashed3;

  // private
  signal input password;

  // intermediate
  signal out1;
  signal out2;
  signal out3;
  signal final1;
  signal final2;

  component hasher = Poseidon(1);
  hasher.inputs[0] <== password;  

  out1 <== (hasher.out - passwordHashed1);
  out2 <== (hasher.out - passwordHashed2);
  out3 <== (hasher.out - passwordHashed3);

  final1 <== out1 * out2;
  final2 <== final1 * out3;

  final2 === 0;

}

component main {public [passwordHashed1, passwordHashed2, passwordHashed3]} = CheckPassword();
