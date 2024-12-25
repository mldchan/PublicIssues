# Public Issues

Allow people outside of GitLab, GitHub or Forgejo to create issues in your repositories. Allow people to create issues inside your private repositores.

## Why?

I have recently moved away from GitHub to my personal GitLab instance due to privacy concerns regarding AI. With this, I limited my GitLab instance's account registration to a very low amount of people (friends).

This project aims to fix one thing: Ability to report bugs or create suggestions for projects. It allows people to report bugs without a GitLab account for my instance. If you selfhost GitLab/Forgejo, this will allow reporting issues/bugs in your repositories too.

## Setup

All you have to do to set this up is set the environment variables for the project:

```
ISSUE_TYPE=gitlab # Or forgejo/github
GITHUB_TOKEN=
GITLAB_TOKEN=
GITLAB_INSTANCE=
FORGEJO_TOKEN=
FORGEJO_INSTANCE=
```

Fill the parameters as needed. If you use Issue Type of GitLab, don't fill out GitHub and Forgejo, it's not required.

When you start the app, you can then choose settings per project: Show it in the app, allow creating issues, creating forms for submitting templated issues, and so on.

## Contributing

Please use the [public instance of this software](https://issues.mldchan.dev) to make a feature request or a bug report. You can create any suggestions you want and I'll be happy to implement them if they are reasonable.

## Running your instance

1. Clone the repository into your computer.
2. Go in the directory of the project.
3. Copy `docker-compose.example.yml` to `docker-compose.yml` and fill in the environment variables inside this file.
4. Run `docker compose build` to build the images and prepare them for starting.
5. Run `docker compose up -d` to run your own instance.
6. Go to localhost:3000 and create an admin account.
7. Set up your projects and you're done!
