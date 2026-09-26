# Products

A product is a deployable application composed from components. It is a
composition root: deployed, never depended on. Every product sits directly
under `products/`. A product is implemented once per target it ships to, and
each target is one directory under the product.

```text
products/
|-- README.md
|-- <name-1>/
|   |-- README.md         # what the product is
|   |-- ios/              # iOS app
|   |-- android/          # Android app
|   |-- macos/            # macOS app
|   |-- linux/            # Linux desktop app
|   |-- console/          # command-line interface
|   |-- service/          # web service
|   |-- sql/              # database: schema, functions, and data the product owns
|   `-- infra/            # host setup, service installs, deploy scripts
|-- <name-2>/
|   |-- README.md
|   |-- console/
|   `-- sql/
|-- <name-3>/
|   `-- ...
`-- ...
```

A target is named for where it runs, not for the language it is written in.
Targets include `ios/`, `android/`, `macos/`, `linux/`, `windows/`, `web/`,
`console/`, `service/`, `sql/`, and `watchos/`; the list is open, and a product
declares only the targets it ships to. Infrastructure a product needs is
defined by that product and lives in its `infra/`.

## License

[License](../LICENSE)
