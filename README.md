# Botpress-Super-Connector
Botpress connector for RocketChat

Create for Google Summer of Code 2023

## Getting Started
clone this repo and cd into it
```bash
git clone https://github.com/BotpressXRocketChat/Botpress-Super-Connector.git
cd Botpress-Super-Connector
```

spin up the docker environment:
```
docker compose up -d
```
configure Rocket.Chat and Botpress:
* Rocket.chat: http://loclahost:3000
* Botpress: http://loclahost:3001

install rc-apps
```
npm install -g @rocket.chat/apps-cli
```

build this app
```
rc-apps package
```

You app should be in the dist folder. Now you can install it at Rocket.Chat under private apps.

## Documentation
Here are some links to examples and documentation:
- [Rocket.Chat Apps TypeScript Definitions Documentation](https://rocketchat.github.io/Rocket.Chat.Apps-engine/)
- [Rocket.Chat Apps TypeScript Definitions Repository](https://github.com/RocketChat/Rocket.Chat.Apps-engine)
- [Example Rocket.Chat Apps](https://github.com/graywolf336/RocketChatApps)
- Community Forums
  - [App Requests](https://forums.rocket.chat/c/rocket-chat-apps/requests)
  - [App Guides](https://forums.rocket.chat/c/rocket-chat-apps/guides)
  - [Top View of Both Categories](https://forums.rocket.chat/c/rocket-chat-apps)
- [#rocketchat-apps on Open.Rocket.Chat](https://open.rocket.chat/channel/rocketchat-apps)
