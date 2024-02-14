# Swagger

Local backend API documentation is exposed at: `localhost:3000/api/docs`

# Architecture notes

The backend uses an 
[hexagonal architecture](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software)), 
that is reflected by the folder structure: 

```
src/

└── [model]             // Name of main entity
    ├── application     // Service entry point, with dependency injection and data validation
    ├── controller      // Interfaces for external access (primary adapter)
    ├── domain          // All domain specific code (self-standing)
    └── infrastructure  // Access to third-party services (secundary adapter)
```

## Structure of the domain

The domain uses the [DDD repository pattern](https://en.wikipedia.org/wiki/Domain-driven_design):
- the methods for retrieving domain objects from external data sources are in "repositories", which signature is defined in the "spi.ts" 
files ("spi" stands for "Service provider interface")
- domain features (primary ports) are defined in the `{model}Features` classes, which take repositories as input.
- the concrete implementations of the repositories live in the infrastructure layer, and are injected at service creation (`*Service` 
classes initialization) in the application layer. 

This allows domain to be self-standing - no imports from outside of the domain should be made in the domain.

