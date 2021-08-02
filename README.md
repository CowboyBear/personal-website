# My personal website
Have you ever noticed how many IT professionals don't have their own website? Well, this project is meant to solve just that! You should be able to create your own personal website by simply editing the content on the `assets/config/content.json` file (more about that in the configuration section).

## Roadmap 
New features will be added following a **rigorous "*Whenever-I-Feel-Like-It*" schedule** (and you're reading this from the guy who took 3 months to write down a simple README file). The good part is that I already have a pretty good idea of how things should look like in the future, the list is ordered, check it out:

  * Dark theme (and maybe other themes as well?)
  * Internationalization: The idea is to have an `assets/config/<language>/content.json` file and allow th user to select the language they want to use
  * Generating PDF resumes: Imagine whenever someone asks for a resume you simply send them a link like https://yourname.com/resume that contains a downloadable PDF version of whatever you added to your career page. Cool isn't it?
  * License: Still deciding on that but, ideally, I want to keep this project open source so people can either contribute or create their own version. At the same time, I'd like some credit :) 
  * Prettier layout: I'm considering paying someone who actually knows what they're doing in terms of UX/UI


## Configuration
At this point, the only thing you need to do is alter the configuration file (`assets/config/content.json`) with the information you want to show on your website. As of now, all properties are required and you also need to provide the path to all images you're willing to use (the image properties usually end with "Src", e.g. "logoSrc", "iconSrc", "emblemSrc", etc...).


## Running locally

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.10.

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files. Since the application runs on Google Cloud Run, a Dockerfile and a docker-compose.yaml are also provided to allow application containarization, running a `docker-compose up` will also work.


## Contributing
PR's are always welcome.