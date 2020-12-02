# Giftree

Giftree is the perfect holiday app for family, friends, and coworkers to share wshlists and gift ideas for every event.

## Table of Contents

- [Getting Started](#getting-started)
- [App Preview](#app-preview)

## Getting Started

- [Download the installer](https://nodejs.org/) for Node LTS.
- Install the ionic CLI globally: `npm install -g @ionic/cli`
- Clone this repository using the ssh option on the github repo page.
  `git clone git@github.com:giftree-app/giftree.git`
- Follow the Development steps below

## Development Steps

1. Always make a new branch that branches from main

   `git checkout main`

   `git pull origin main`

   `git checkout -b "branch-name"`

2. Make sure you've installed all npm requirements

- In the root folder `giftree/` run:
  `npm install`

- Then switch to the `giftree/frontend` folder and run:

  `npm install`

  `ionic build`

  If the above doesn't work and you're still getting npm errors try:

- Deleting package-lock.json in both the root directory `giftree/` and inside `gitftree/frontend/`

- re-run the commands above inside each folder

3.  Make sure you have a `.env` file with the required creds that looks like this:

        MONGODB_URI=mongodb+srv://username:password@cluster0.mdaeo.azure.mongodb.net/Giftree?retryWrites=true&w=majority

        SENDGRID_API_KEY=sendgrid_api_key

        DEBUG=express:\*

        NODE_ENV=development

4.  After you're done making changes and want to see what they look like on the brower, do the following:

- Go into `gitfree/frontend` and run `ionic build`. You have to do this every time you want to see the changes you made.

- Go back to the root folder `giftree` and run `npm start`

- Go to http://localhost:5000/ to see the changes

5. If you're making changes and it seems like the changes aren't reflected on localhost try the following:

- Right click in your browser and select "inspect" to access dev tools and the console
- On the tabs select Application (you might have to press the arrow to expand), then under Cache/Cache Storage on the left sidebar, right click whatever is in there and delete it.
- Right click the refresh button and select "Empty Cache and Hard Reload".

5. When you're ready to open a pull request

- Get the most recent changes from main

  `git checkout main`

  `git pull origin main`

- Go back to your branch to align it with main

  `git checkout "your-branch"`

  `git merge main`

- If there are git conflicts fix them or if you need help message on discord

- Once you finish fixing the conflicts, commit and push the changes

  `git commit -m "merged with main"`

  `git push`

- Go into github and open a pull request with main as the destination branch

## App Preview

### Figma Design

On Figma, we designed some mocks of what we envisioned the app to look like and you can check that out [here](https://www.figma.com/file/T4OWxxJvtxK7UzdSXaAa4g/giftree-design?node-id=0%3A1)

## About Us

We are a small team of 7 who are doing this small project for our Software Development college class.

## Github Links

- https://github.com/cdiazucf
- https://github.com/gdijkhoffz
- https://github.com/Naderx77
- https://github.com/aileenpongnon
- https://github.com/DominiekMeers
- https://github.com/Dolamide
- https://github.com/ChristyWCpE
