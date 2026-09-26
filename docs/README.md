# Docs

Framework-wide documents, split by role.

```text
docs/
|-- specs/      # normative: what a thing is
|-- guides/     # instructional: how to author one, with the guide's templates
|-- skills/     # pi-skills: runnable pipelines that implement a guide
|-- reviews/    # reviews, analyses, and due diligence
|-- wip/        # drafts of any role, not yet authoritative
`-- writing/    # blogs, books, vision, and other prose for people
```

- `.spec.md` is normative and lives in `specs/`.
- `.guide.md` is instructional and lives in `guides/`.
- `.canon.md` is a rule set derived from a spec or guide and lives in `guides/`.
- `.prompt.md` is a prompt run as written and lives in `guides/`.
- `.review.md` reviews existing work and lives in `reviews/`.
- `.analysis.md` and `.diligence.md` investigate an option before a decision
  and live in `reviews/`.
- `.plan.md` is a plan of work and lives in `wip/`.
- `.blog.md` is prose for people and lives in `writing/`.

The kind is the last suffix before `.md`; earlier suffixes name the subject
(`slug.type_domain.canon.md`, `front_matter.audit.spec.md`).

A document that describes exactly one component lives with that component under
`components/<name>/_specs/` or `_docs/`, not here.

A skill is a guide rendered to a runnable pipeline, so it sits beside the
guides. `docs/skills/*` is a workspace glob in `pnpm-workspace.yaml`.

## License

[License](../LICENSE)
