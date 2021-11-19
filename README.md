# laboratory guided tour
This branch contains extra code to add a guided tour to laboratory.
I've created this as part of [Meridian 2021](https://meridian.stellar.org/) Docpprint.

The reason for this tour is, that every developer getting into stellar will sooner or later stumble over Laboratory.
And I as a Stellar Quest Lumenaut can tell: Understanding Laboratory at first can be challenging.
So this tour is an attempt to make onboarding for new Stellar Developers (or others interested in Low-Level Stellar Transactions) easier.

For now I won't submit a PR to the upstream repository. This has multiple reasons:
 - I'm not nearly done with this and as I'm not a good writer I'd love some other people to help me write texts.
 - I didn't have much time around meridian and I'd love to have a "first glance at all pages" tour like I have right now and a deeper "your first Laboratory testnet account and transaction"-Tutorial.
 - The code has some hackarounds to make it work. Most if not all of them can be cleaned up by using laboratories state management instead of "clicking" elements.

I also don't know if the Lab-Team is interested in onboarding like this. 
If you're from Lab team feel free to tell me in an issue or on the developer discord: KanayeNet#1839

If you got suggestions or ideas for this: Open a issue or PR if you'd like to contribute!

I'll remove this message (and commit) before I'll submit a PR or Draft.

Thanks for reading
- Kanaye
====
# laboratory

The Stellar Laboratory is a suite of tools to help one learn about exploring the
Stellar network. See it in action:
[https://www.stellar.org/laboratory/](https://www.stellar.org/laboratory/).

## Developing

```sh
yarn start
```

Testing hardware wallets requires an HTTPS connection to enable U2F. The
recommended way to do this is with [`ngrok`](https://ngrok.com/). Once
downloaded and authenticated, start ngrok, and tell the laboratory to start with
a public URL.

```bash
./ngrok http 3000
# in a separate terminal
# the subdomain will appear in ngrok's output
yarn start --public randomsubdomain.ngrok.io
```

## Building for production

```sh
yarn build
```

To build a production docker image using a clean docker build environment:

```sh
make docker-build
# or directly with docker
docker build --build-arg AMPLITUDE_KEY=${AMPLITUDE_KEY} -t lab:localbuild .
```

To build and run production build locally:
```sh
yarn production
# or
yarn prod:build
yarn prod:serve
```

Production uses Amplify to emit metrics, so to fully emulate a production build, you'll need to set an `AMPLITUDE_KEY` environment variable in the shell you start a build from.

## Internal documentation

The [docs.md](./docs.md) file contains code documentation on the laboratory. The
docs.md is only relevant for developing the laboratory.
