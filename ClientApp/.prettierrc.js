module.exports = {
    //The maximum number of characters in a line
    printWidth: 150,
    //Specify the number of spaces for each indentation level
    tabWidth: 2,
    // Use tabs instead of spaces to indent lines
    useTabs: true,
    //Print a semicolon at the end of the statement
    semi: true,
    // Use single quotes instead of double quotes
    singleQuote: true,
    // The time to change the referenced object property. Optional value "<as-needed|consistent|preserve>"
    quoteProps: 'as-needed',
    // Use single quotes instead of double quotes in JSX
    jsxSingleQuote: false,
    // Print trailing commas when possible on multiple lines. (For example, a single-line array will never end with a comma.) Optional value "<none|es5|all>", default none
    trailingComma: 'es5',
    // Print spaces between brackets in object literals
    bracketSpacing: true,
    // The back angle brackets of the jsx tag need to be wrapped
    jsxBracketSameLine: false,
    // Include parentheses around individual arrow function arguments always: (x) => x \ avoid: x => x
    arrowParens: 'always',
    // These two options can be used to format code that starts and ends with a given character offset (inclusive and exclusive respectively)
    rangeStart: 0,
    rangeEnd: Infinity,
    //Specify the parser to be used, no need to write @prettier at the beginning of the file
    requirePragma: false,
    // No need to automatically insert @prettier at the beginning of the file
    insertPragma: false,
    // Use default line wrapping criteria always\never\preserve
    proseWrap: 'preserve',
    //Specify the global space sensitivity of HTML files css\strict\ignore
    htmlWhitespaceSensitivity: 'css',
    // Vue file script and style tag indentation
    vueIndentScriptAndStyle: false,
    // The newline character uses lf and ends with the optional value "<auto|lf|crlf|cr>"
    endOfLine: 'lf',
};