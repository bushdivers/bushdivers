### Bush Divers VA Platform - Development Environment Setup in Docker

Notes about setting up a development environment for the Bush Divers VA platform using Docker.

To contribute, get setup as per below and look through some of the issues on Github.
You will then need to raise a Pull Request to get your changes added.

## Resources
Here's a [great Git primer](https://www.madebymike.com.au/writing/how-to-git/)

## Process
- In github, fork [russellwwest/bushdivers](https://github.com/russellwwest/bushdivers) to your own account  
- Clone your fork of the repository to your development machine 
- Go to your local folder for the application using cd command on your cmd or terminal
- Follow the instructions at https://docs.npmjs.com/downloading-and-installing-node-js-and-npm to confirm you have the latest version of npm, and install or upgrade it if you don't. 
- Run 'npm install' and 'npm audit fix' to install dependencies
- Check 'php -v' - should be 8.0
  - On MacOS and Homebrew you can install using ' brew install php@8.0' (
  - brew unlink php && brew link --overwrite --force php@8.0'
- Run 'composer install' or 'composer self-update' if already installed
- Run 'composer update'
- Copy _.env.example_ to _.env_ and edit as necessary
  - Database name...
- Run 'npx mix' to complile react js and css files
- Run 'php artisan key:generate'
- Run 'alias sail="bash vendor/bin/sail"' - note the double quote at the end
- Run 'sail up -d'
- Run 'sail artisan migrate'
- Run 'sail artisan db:seed'
- In your browser, go to 'localhost'
 
To recompile after making changes to /resources/js/Pages etc
-run 'npx mix'
To automatically recompile every time you save
-run 'npx mix watch'

---
Probably delete
- Run php artisan serve
- Go to localhost:8000


---
Nuclear option - wipe everything!
- sail down --rmi all -v
- sail up -d
