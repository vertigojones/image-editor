# Image Editor App

A lightweight Next.js application using Tailwind CSS and TypeScript that allows users to:
- Browse images from the [Lorem Picsum API](https://picsum.photos/)
- Pagination and horizontal carousel for image navigation
- Edit images:
  - Adjust width and height
  - Toggle greyscale mode
  - Apply blur (0–10)
- Real-time image preview
- Download edited images
- Local storage persistence for edits
- Session-based return-to-gallery page memory

## Technical Decisions

- **Next.js App Router** used for modern routing and layout patterns.
- **Tailwind CSS** for rapid, consistent styling.
- **TypeScript** with custom types (`ImageData`) to ensure type safety.
- **React Testing Library + JSDOM** used for comprehensive unit tests.
- Image downloads use a **canvas-based approach** to apply live transformations.


## Features

### Homepage
- Fetches and displays images from the public Lorem Picsum API.
- Implements horizontal scrolling (carousel) for visual navigation.
- Pagination controls allow moving forward/backward through image sets.
- Images are clickable and redirect to the edit screen.

### Edit Image Page
- Loads image metadata based on URL ID.
- Inputs for width and height with validation.
- Toggle switch for greyscale.
- Slider for blur (0–10).
- Several quick presets (original, black & white, 4:3, 1:1).
- "Download Edited Image" generates a canvas and triggers download.
- All settings are persisted to `localStorage` for each image ID.

## Technologies Used

- **Next.js** (App Router, `use client`)
- **React** (with hooks)
- **Tailwind CSS** for responsive, utility-first design
- **TypeScript** with strong typing and ESLint rules
- **Jest** and **React Testing Library** for unit testing

## Setup Instructions

```bash
npm install
npm run dev        # for local development
npm run build
npm start          # to preview the production build
npm test           # to run all tests
```

## Testing Notes

- All image editing settings are tested: dimension updates, filter toggling, persistence.
- `window.scrollTo` is stubbed out during test to avoid JSDOM errors.

## Folder Structure

- `/app` - Next.js app directory structure with pages like `/page.tsx` and `/edit/[id]/page.tsx`
- `/__tests__` - Test suite for the HomePage and EditImagePage

## Further Refinements

- Refactor and componentize the code even further.
- Add mock and test to check `img.src` is set to the correct filtered URL (ensuring transformations are applied).
- Use query parameters (e.g., ?page=3) to persist pagination across refreshes and back-navigation instead of sessionStorage.
- Add better focus outlines for interactive elements.
- Improve screen reader support with ARIA labels and landmark roles.
- Consider using zod or io-ts for runtime validation of API responses.
- Add integration tests for the edit workflow.
- Support mouse dragging or touch swiping to improve usability on touch devices for the carousel.
- Implement smarter image preloading and memoization strategies for improved performance when navigating back and forth between pages.
- Introduce subtle page or image load transitions using framer-motion or CSS animations to enhance polish.
- Add support for system preference detection (prefers-color-scheme) or a toggle in the UI.
- Add a service worker (e.g., with next-pwa) to support offline image browsing or editing.

If this were a production app, I’d consider:

- **Lazy loading** images for performance on large datasets.
- **Drag-and-drop or file upload support** to allow user-added images.
- **Undo/redo history** for editing changes.
- Better **error UI** when the API fails.
- Option to **copy direct link** to edited images.
- Adding **E2E tests** with Cypress or Playwright.

## Author

Owen Liversidge