const alphabets = {
  numeric: "1234567890",
  alpha: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  alphaUpper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  alphaLower: "abcdefghijklmnopqrstuvwxyz",
} as const;

export const entropy = {
  fromAlphabet: (
    getAlphabet:
      | ((
          _alphabets: typeof alphabets
        ) => (typeof alphabets)[keyof typeof alphabets])
      | string,
    size: number = 12
  ): string => {
    const alphabet =
      typeof getAlphabet === "function" ? getAlphabet(alphabets) : getAlphabet;
    const alphabetArr = alphabet.split("");

    return Array.from({ length: size })
      .map(() => alphabetArr[Math.floor(Math.random() * alphabetArr.length)])
      .join("");
  },
};

entropy.fromAlphabet((a) => a.alpha);
