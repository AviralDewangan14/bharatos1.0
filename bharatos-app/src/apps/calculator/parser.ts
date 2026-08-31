export function parseAndEvaluate(expression: string): number {
  const tokens = tokenize(expression);
  const parser = new Parser(tokens);
  return parser.parse();
}

type Token = { type: 'NUMBER'; value: number } | { type: 'OPERATOR'; value: string } | { type: 'LPAREN' } | { type: 'RPAREN' };

function tokenize(input: string): Token[] {
  let cursor = 0;
  const tokens: Token[] = [];

  while (cursor < input.length) {
    const char = input[cursor];

    if (/\s/.test(char)) {
      cursor++;
      continue;
    }

    if (/[0-9.]/.test(char)) {
      let numStr = '';
      while (cursor < input.length && /[0-9.]/.test(input[cursor])) {
        numStr += input[cursor];
        cursor++;
      }
      tokens.push({ type: 'NUMBER', value: parseFloat(numStr) });
      continue;
    }

    if (/[+\-*/%^]/.test(char)) {
      tokens.push({ type: 'OPERATOR', value: char });
      cursor++;
      continue;
    }

    if (char === '(') {
      tokens.push({ type: 'LPAREN' });
      cursor++;
      continue;
    }

    if (char === ')') {
      tokens.push({ type: 'RPAREN' });
      cursor++;
      continue;
    }

    throw new Error(`Invalid character: ${char}`);
  }

  return tokens;
}

class Parser {
  private cursor = 0;
  private tokens: Token[];

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token | null {
    return this.tokens[this.cursor] || null;
  }

  private next(): Token | null {
    return this.tokens[this.cursor++] || null;
  }

  parse(): number {
    const result = this.parseExpression();
    if (this.cursor < this.tokens.length) {
      throw new Error('Unexpected tokens at end of expression');
    }
    return result;
  }

  private parseExpression(): number {
    let left = this.parseTerm();

    while (true) {
      const token = this.peek();
      if (token && token.type === 'OPERATOR' && (token.value === '+' || token.value === '-')) {
        this.next();
        const right = this.parseTerm();
        left = token.value === '+' ? left + right : left - right;
      } else {
        break;
      }
    }

    return left;
  }

  private parseTerm(): number {
    let left = this.parseFactor();

    while (true) {
      const token = this.peek();
      if (token && token.type === 'OPERATOR' && (token.value === '*' || token.value === '/' || token.value === '%')) {
        this.next();
        const right = this.parseFactor();
        if (token.value === '*') left *= right;
        if (token.value === '/') left /= right;
        if (token.value === '%') left %= right;
      } else {
        break;
      }
    }

    return left;
  }

  private parseFactor(): number {
    let left = this.parsePrimary();

    const token = this.peek();
    if (token && token.type === 'OPERATOR' && token.value === '^') {
      this.next();
      const right = this.parseFactor();
      left = Math.pow(left, right);
    }

    return left;
  }

  private parsePrimary(): number {
    const token = this.next();

    if (!token) {
      throw new Error('Unexpected end of expression');
    }

    if (token.type === 'NUMBER') {
      return token.value;
    }

    if (token.type === 'OPERATOR' && token.value === '-') {
      return -this.parsePrimary();
    }

    if (token.type === 'LPAREN') {
      const value = this.parseExpression();
      const nextToken = this.next();
      if (!nextToken || nextToken.type !== 'RPAREN') {
        throw new Error('Missing closing parenthesis');
      }
      return value;
    }

    throw new Error('Invalid expression');
  }
}
