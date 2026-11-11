type FontOptions = {
  variable: string;
  family: string;
  [key: string]: unknown;
};

export function remoteFont({ variable, family }: FontOptions) {
  return {
    variable,
    style: { fontFamily: `'${family}'` },
  };
}
