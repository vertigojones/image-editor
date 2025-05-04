# Image Editor App

A lightweight Next.js application using Tailwind CSS and TypeScript that allows users to:
- Browse images from [Lorem Picsum](https://picsum.photos/)
- View them in a horizontal carousel
- Click an image to edit it
- Apply effects (greyscale, blur), change dimensions
- Download the edited version
- Navigate across paginated image sets

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

## Author

Owen Liversidge