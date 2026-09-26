# Opustotale

Opustotale is solving software engineering.

Opustotale is creating a codex of type kinds, entity kinds, and behavior, already coded and generated in TypeScript, Rust, Kotlin, Swift, and PostgreSQL. The codex lets code generators write as much of each program as possible, with an LLM as the fallback.

The hard part, the business logic, is moved to configurable composition which composes the kinds and behavior into applications. LLMs do most of this work.

Where a model is needed, Opustotale uses standard models that are cheaper and faster than frontier models. It also leverages transformer-based models, such as embedding models.

The system is designed mostly around integrating agentic harnesses with the applications it delivers. Any application built with Opustotale can also be its own agentic harness. Its users can hyper-personalize it together while it runs, through an agent or visual programming.

In the long run, all applications are expected to become one hyper-personalized application. A website, an Electron app, a game, a task manager, a music player, and a digital audio workstation coexist in it, and any part can compose with any other. The applications in it include end-user software and the operational and go-to-market systems around a product.
