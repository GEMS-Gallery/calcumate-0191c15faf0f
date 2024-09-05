export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Int, 'err' : IDL.Text });
  return IDL.Service({
    'calculate' : IDL.Func([IDL.Int, IDL.Int, IDL.Text], [Result], []),
    'clear' : IDL.Func([], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
