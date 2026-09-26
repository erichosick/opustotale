# Components

A component is one named unit of the framework, declared once and rendered once
per platform. Every component sits directly under `components/`; there are no
grouping directories.

```text
components/
|-- README.md
|-- <name-1>/
|   |-- README.md         # what the component is
|   |-- _docs/            # documentation for this component only
|   |-- _specs/           # specifications for this component only
|   |-- ts/
|   |   |-- lib/          # npm package
|   |   `-- mech/         # mechanism npm package
|   |-- rust/
|   |   |-- lib/          # cargo crate
|   |   `-- mech/         # mechanism cargo crate
|   |-- kotlin/
|   |   |-- lib/          # gradle module
|   |   `-- mech/         # mechanism gradle module
|   |-- swift/
|   |   |-- lib/          # swift package
|   |   `-- mech/         # mechanism swift package
|   `-- sql/
|       `-- lib/          # sqlpm SQL package
|-- <name-2>/
|   |-- README.md
|   |-- _specs/
|   `-- ts/
|       `-- mech/         # a mechanism-only component binds one platform, one slot
|-- <name-3>/
|   `-- ...
`-- ...
```

The platforms are `ts/` (TypeScript), `rust/`, `kotlin/`, `swift/`, and `sql/`
(PostgreSQL). A platform directory is a plain container, never a package. It
holds `lib/`, the platform's own code, and `mech/`, the mechanisms rendered to
that platform.
`mech/` may depend on `lib/`; `lib/` never depends on `mech/`. A component
declares only what it binds to: a platform it never targets has no directory,
and a `mech/` with no sibling `lib/` is ordinary.

A specification used by this component alone lives in `_specs/`. One shared by
several components, or that defines the framework, lives in `docs/specs/`.

## License

[License](../LICENSE)
