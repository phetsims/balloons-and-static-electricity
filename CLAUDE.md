# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the "Balloons and Static Electricity" PhET simulation - an educational HTML5 simulation that demonstrates static electricity concepts through interactive balloons, a sweater, and a wall.

## Essential Commands

**Development workflow:**
- `grunt type-check` - Run TypeScript type checking
- `grunt lint --fix` - Run ESLint

## Code Architecture

### Model Structure
- **BASEModel**: Main model containing all simulation components (balloons, sweater, wall)
  - Manages play area bounds and object interactions
  - Uses unitless forces for physics calculations (not true physical units)
  
- **BalloonModel**: Handles all force calculations and balloon movement
  - Calculates forces between balloon-sweater, balloon-wall, and balloon-balloon
  - Uses modified Coulomb's law: F = kq₁q₂/r³ (note: r³ not r²)
  - Different k constants for different interactions (0.1 for sweater, 10000 for wall)
  
- **Charge Models**:
  - `PointChargeModel`: Basic charge representation for all objects
  - `MovablePointChargeModel`: Charges in the wall that can move (induced charge)
  - Charges don't actually transfer between objects - visibility changes simulate transfer

### View Structure
- **No model-view transform**: Everything operates in ScreenView coordinates
- **BASEView**: Main view component
- **BalloonNode**: Renders balloons with drag interaction
- **Charge rendering**: Plus/minus charge nodes with predetermined positions

### Key Features
- **Accessibility**: Full keyboard navigation and screen reader support via `BASEDescriber` and related components
- **Sound**: Balloon rubbing, velocity, and charge deflection sounds
- **PhET-iO**: Instrumentation for data collection and customization

### Memory Management
- All objects persist for simulation lifetime
- No dynamic object creation/destruction needed
- No need for unlink/dispose patterns

## Important Notes

1. **Force Calculations**: The physics model is intentionally non-physical to create better user experience. Forces are unitless and scaled empirically.

2. **Charge Transfer**: Occurs when balloon's left edge intersects sweater charges at sufficient speed (5-frame velocity average).

3. **Coordinate System**: Everything uses ScreenView coordinates directly - there's no separate model coordinate system.

4. **Query Parameters**: See `BASEQueryParameters.js` for simulation-specific parameters.

5. **Dependencies**: This simulation requires numerous PhET common libraries (axon, scenery, joist, etc.) as listed in package.json.

## Environment

- This is developed as part of a monorepo. If you need details for any dependencies, you can follow the import paths
  imports. You will be approved to read files outside our working directory.
- If you would like to see how it was done in other simulations, you can search for patterns in '../' and you will be
  approved to read the code in those directories.
- When getting the contents of a file, it probably has a *.ts suffix even though it is imported as *.js.
- Read ./doc/model.md and ./doc/implementation-notes.md when you need more context about the simulation.

## Code Style

- Use TypeScript with explicit typing for all properties and parameters
- Access modifiers (`public`, `private`) required for class members
- Class names: PascalCase, Files: kebab-case, Variables/Methods: camelCase
- Properties use PhET's Property system (NumberProperty, BooleanProperty)
- Boolean properties begin with verbs (`is`, `has`, `show`)
- Model classes should never import from view
- Use parameter destructuring for object configs
- Include JSDoc comments for all methods and classes
- Add tandem parameters for PhET-IO integration
- Use explicit file extensions in imports (.js)

## TypeScript Conversion Rules

When converting JavaScript files to TypeScript in PhET projects:

1. **File Renaming**:
  - Use `git mv filename.js filename.ts` to preserve git history
  - Immediately commit ONLY the rename: `git add filename.ts && git commit -m "Rename filename.js to .ts, see https://github.com/phetsims/charges-and-fields/issues/208"`
  - Do NOT push
  - Claude should ONLY commit the rename - the developer will review and commit all other changes
2. **Required Imports**:
  - Add `import Tandem from '../../../../tandem/js/Tandem.js';` for tandem parameters
  - Add `import IntentionalAny from '../../../../phet-core/js/types/IntentionalAny.js';` when you need `any` types
  - Import `PhetioObjectOptions` when extending PhetioObject: `import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';`
3. **Property Declarations**: All class properties must be declared with explicit types and access modifiers:
   ```typescript
   public readonly electricFieldProperty: Vector2Property;
   private readonly computeElectricField: ( position: Vector2 ) => Vector2;
   ```
4. **Constructor Parameters**: Must have explicit types and public access modifier:
   ```typescript
   public constructor( computeElectricField: ( position: Vector2 ) => Vector2, initialPosition: Vector2, tandem: Tandem )
   ```
5. **Method Access Modifiers**: All methods require explicit access modifiers (`public`, `private`)
6. **Override Methods**: Methods overriding base class methods need `override` modifier:
   ```typescript
   public override dispose(): void
   ```
7. **Remove JSDoc Type Annotations**: Remove `@param {Type}` and `@public` JSDoc comments - use TypeScript types instead
8. **Property Documentation**: Document properties at declaration site, not assignment site in constructor
  - Add blank lines before line comments for better readability
9. **Validation Commands**: Always run `grunt type-check` and `grunt lint --fix` after conversion
10. **Liberal @ts-expect-error**: Use `@ts-expect-error` for unresolved issues to focus on one file at a time

## Common TypeScript Patterns in PhET

1. **Property Types**:
  - `Vector2Property` for position/vector properties
  - `Property<number>` for numeric values
  - `BooleanProperty` for boolean flags

2. **Import Pattern**:
  - Always use `.js` extension in imports even for TypeScript files
  - Common imports needed: `import Tandem from '../../../../tandem/js/Tandem.js';`

3. **Property Patterns**:
  - Use `readonly` for properties that shouldn't be reassigned

4. **Static IOType Pattern**:
  - Declare static IOType property in class: `public static ModelElementIO: IOType<ModelElement, IntentionalAny>;`
  - Assign after class definition: `ModelElement.ModelElementIO = new IOType<ModelElement, IntentionalAny>(...);`
  - Cannot use `readonly` for static IOType properties that are assigned after class definition

5. **Handling Legacy Code**:
  - Use `IntentionalAny` instead of `any` to satisfy lint rules
  - Add `// eslint-disable-next-line phet/bad-typescript-text` before `merge` function calls
  - Remove redundant type assertions (e.g., `instanceof` checks) when TypeScript already enforces the type
  - Use non-null assertion (`!`) for required options like tandem: `const tandem = options.tandem!;`

6. **Global Variables**:
  - Keep `/* global TWEEN */` comments when code uses global libraries

## Conversion Process Summary

1. `git mv file.js file.ts` (preserves git history)
2. **Commit the rename immediately**: `git add file.ts && git commit -m "Rename file.js to .ts, see https://github.com/phetsims/charges-and-fields/issues/208"`
3. Run `grunt type-check` and `grunt lint --fix` to see all issues
4. Add necessary imports (especially Tandem)
5. Add property declarations with types and access modifiers
6. Fix constructor parameters and add access modifier
7. Fix method access modifiers and add `override` where needed
8. Remove JSDoc type annotations
9. Add blank lines before line comments
10. Run validation commands again to verify
11. **Developer will review and commit the TypeScript conversion changes**