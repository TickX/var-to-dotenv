![](https://github.com/TickX/var-to-dotenv/workflows/Test/badge.svg)
![GitHub license](https://img.shields.io/github/license/TickX/var-to-dotenv)

# Variable to Dotenv

A GitHub action that appends a variable to a dotenv file.

## Usage

```yaml
steps:
  - uses: TickX/var-to-dotenv@v1.0.0
    with:
      key: 'SOME_API_URI' # [Required]
      value: ${{secrets.SOME_API_URI}} # [Required]
      default: 'https://api.alt.com' # [Optional] if `value` is empty, this is used instead
      envPath: '.env' # [Optional] The path to the dotenv file (defaults to `.env`)
```

You can use this more than once in your workflow to add multiple variables.
