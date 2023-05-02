export const idlFactory = ({ IDL }) => {
  const anon_class_8_1 = IDL.Service({
    'getCounts' : IDL.Func([], [IDL.Text], []),
    'increment' : IDL.Func([], [IDL.Nat], []),
  });
  return anon_class_8_1;
};
export const init = ({ IDL }) => { return []; };
