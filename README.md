# Document Viewer Test Task

I've assumed that I cannot use external libraries for sticky note manipulation, so I've implemented it myself.

So, every sticky note is a relative-positioned div element. Every time a sticky note moves, gets added, or is deleted, the page margin and other sticky note offsets get recalculated.

### Update (07 April 2023)
The app works now as expected, the performance was improved drastically, and there is no 'ts-ignore' or 'any' in the code.

### Pros
1. It works.
2. It can be scaled and refactored.
3. The app itself is lightweight.
### Cons
1. The implementation is very naive and straightforward.
2. ~~Sticky notes are twitchy and buggy (see details below).~~
3. There is no fancy output, only a console.

### Known issues
1. ~~When the sticker is moved, its appearance is twitchy.~~
2. ~~When the sticker is moved, a new sticker might be created.~~
3. ~~Image stickers do look not so good.~~

### What should be done
1. It would be better to take some library for sticky note manipulation, rather than re-inventing it.
2. There should be some decent unit test coverage.
3. Would be nice to have re-sizing, color, and opacity options.
4. A real API with image uploading would be great as well.

## How to run it

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/viewer/1`.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.
