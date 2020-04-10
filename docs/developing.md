# Developing

This document describes procedures for working with this codebase.

Common procedures:

- bug fix
- update dependencies
- adding a test
- updating a test
- new build and release
- use locally in ui
- ...

## Local Development Workflow

This app is based on Create React App with TypeScript. As such, it has a well established and simple workflow. We have added two twists.

The basic workflow is:

1. start the development server

```bash
cd react-app
yarn install
yarn start
```

2. A browser will pop up

3. Supply a login token in the browser

4. Edit source code

As source code changes are saved, the app will automatically rebuild and reload code in the browser.
