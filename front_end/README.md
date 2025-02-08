# Lan

### Basic Information
The app has been tested on resolutions of 2560 X 1440 as well as 1920 X 1080.
The best experience can be obtained with 1440P. The app also allows for a limited experience on mobile devices, 
but with poor results.
Only Google Chrome is considered for this application, other kernels or modified versions of browsers
have not been tested in any way. The application uses Node JS 16.17.0 LTS as the development version. 
This means that the behavior is undefined using other versions of Node JS.

### IMPORTANT: Unit Test
All the tests need to run below "--transformIgnorePatterns".
Because the nano id is not use es module, it may cause compilation errors.

<br/>

Use "npm test" command to run all tests, please start mid-layer before start.
The test files are:


### Run
Just use "npm run start" to run this webpage.

### Library

- Bootstrap: Provide CSS for layout design.
- Nanoid: Generate unique ID for user, post and replies.
- Normalize.css: [Unused] Use to reset some CSS rule.
- React-bootstrap: A wrapper for bootstrap.
- React-hook-form: Make code reusable, reduce duplicate validation code. Also improve the readability of the code.
- React-router-dom: OPA router support component. We must use this library.
- Sass: Compile SCSS files. Provides customization of bootstrap and more advanced “CSS” features.
- Typescript: Support Typescript programming language.
- Web-vitals: Create react app include. Unused in this project.
- Axios: Send HTTP request.
- React-quill: Rich text editor.
