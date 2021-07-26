# static-webapp-angular-csharp


This repo is designed to act as a template or starter for a new Azure Static Web App. It is a simple hello world project with an Angular 11 front end, and uses C# (.NET Core 3.1) for the functions for the back end API(this exists as a Visual Studio solution in the Api folder).

The client project is based off of the [angular-basic repo](https://github.com/staticwebdev/angular-basic). As well as extending it to include a simple API with an example api call to it from the angular project, the other main differences are:

* this angular project has the routing module included with a simple example (see ```app-routing.module.ts```)
* this angular project uses .scss instead of .css for style sheets

Use the 'Use this template' button or go to https://github.com/ruairicaldwell/static-webapp-angular-csharp/generate to start your own repo from this repo.

After creating your own github repo to get up and running from the Azure portal
1. Create a new resource of type 'Static Web App'
2. Fill out the steps that are self explanatory ie connect to your github etc
3. For the Build Details section to generate the correct github actions CI/CD file
```
Build presets: Angular
App location: Client
Api location: Api
Output location: dist/Client
```

This will create the correct github actions file to automcatically deploy the web app on a push to the branch selected in the previous step (this will run for the first time upon creating the resource).
  
### Example steps to run the project locally

To run the project locally you will have to restore the necessary packages (```npm install``` from within the Client directory and in Visual Studio for the .NET project this can be done in Manage Nuget Packages for Solution) 

1. Get the static web apps CLI ```npm install -g @azure/static-web-apps-cli```
2. Start the function app in Visual Studio
3. In VS Code build the project with ```npm run build```
4. In VS Code run the static web apps command ```swa start dist/Client --api api```
5. Go to ```http://localhost:4280/``` in a browser to access the web app.

See [here](https://docs.microsoft.com/en-us/azure/static-web-apps/local-development) for additional info on running static web apps locally. 


