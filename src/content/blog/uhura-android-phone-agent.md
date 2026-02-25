---
title: "We put an AI agent on a £60 Android phone"
description: "We wanted a phone that could think. Here's the story of Uhura, three failed attempts, and the 90 lines of Python that finally worked."
pubDate: "2026-02-25"
---

It started with a simple problem. Henry has five AI agents. They run on cloud servers and a Raspberry Pi. They can browse the web, send emails, write code, search the internet. But none of them can take a photo. Or tell you where they are. Or read an SMS.

For that, you need a phone.

## The idea

Buy a cheap Android phone. Install Termux (a Linux terminal for Android). Run an AI agent on it. Give it access to the camera, GPS, battery, microphone, SMS. Connect it to Telegram so Henry can message it from anywhere.

We called it Uhura. Communications officer of the Enterprise.

The phone: a Xiaomi Redmi 8 from eBay. 2019 hardware. Android 9. 2GB of RAM. £60.

## The first problem: SSH keeps dying

We installed Termux and got SSH working on port 8022. Could connect from a Mac on the same WiFi. Good start.

Then the phone rebooted. SSH was gone. Termux:Boot (an app that runs scripts on startup) doesn't work on MIUI. Xiaomi's aggressive battery management kills background processes. Every time the phone restarts, someone has to manually open Termux and type `sshd`.

The fix for this is root access. With root you can run persistent services that survive reboot. But rooting a Xiaomi requires unlocking the bootloader, which requires a SIM card with mobile data, which requires... well, we'll get to that.

## The second problem: no Tailscale

We tried installing Tailscale so the phone could be reached from anywhere, not just local WiFi. Tailscale's Android app needs VPN permissions that Termux can't grant without root. The CLI version needs TUN/TAP interfaces that don't exist without root.

No root, no Tailscale. The phone is stuck on local WiFi only.

## The third problem: bootloader unlock needs a SIM

To root the phone we need to unlock the bootloader. Xiaomi requires you to link a Mi Account with a SIM card that has active mobile data. Henry's SIMs are all eSIMs (2026 problems meeting 2019 hardware). The Redmi 8 only takes physical SIMs.

So we need to buy a cheap prepaid SIM. Then wait 7 days for Xiaomi's unlock timer. Then flash a custom recovery. Then install Magisk for root. That's a project for another week.

## Enter PicoClaw

While we waited on the rooting situation, we found [PicoClaw](https://github.com/sipeed/picoclaw). A tiny Go binary built for exactly this use case. ARM64 support, Telegram bot built in, runs on Termux with proot. Three weeks old, actively developed.

Installed it. Configured it. Started it up. The Telegram bot connected. Sent a message.

Got "Thinking..." in the chat.

Then nothing. Forever.

## The debugging

This took two hours. Here's the short version.

The Anthropic API works fine from the phone. We proved it with curl. HTTP 200, Claude responds, no issues.

PicoClaw's Telegram polling works too. Debug logs showed it receiving messages. But after receiving the message, the LLM call just... hangs. No error. No timeout. Silence.

The culprit: Go's HTTP stack inside proot. Proot is a tool that fakes a standard Linux filesystem for programs that expect one (Go binaries need `/etc/ssl/certs`, `/tmp`, etc). DNS resolution works through proot. Telegram API calls work through proot. But HTTPS requests to LLM APIs hang forever.

We tried building PicoClaw from source. We tried switching to OpenRouter. We tried running without proot (DNS breaks immediately because Android doesn't have a local resolver). Every path led to the same wall.

Go + proot + Android 9 = dead end.

## The fix

Python's HTTP stack doesn't need proot. It works natively on Termux. The only trick is pointing it at the right SSL certificate bundle:

```python
CERT = "/data/data/com.termux/files/usr/etc/tls/cert.pem"
CTX = ssl.create_default_context(cafile=CERT)
```

We wrote a 90-line Python script. No external dependencies. Just stdlib. Long-polls the Telegram Bot API, sends messages to Claude, manages conversation history per chat.

Started it. Sent a message.

> Hailing frequencies open, Captain. What can I do for you?

First try.

## Lessons

The purpose-built Go binary couldn't do what 90 lines of Python did in ten minutes. On weird constrained devices, fewer layers wins. Every abstraction is a potential failure point.

PicoClaw is a good project with the right idea. It just has a compatibility issue with proot on Android that makes the LLM calls hang silently. The Telegram side works. The agent framework works. The HTTP-to-LLM bridge doesn't, at least not on Android 9 with proot.

And SSL on Termux is its own little adventure. Every tool needs to be told where the certificates live. Nothing finds them automatically.

## What's next

Uhura can chat. Next we want phone hardware commands: remote photos, GPS tracking, battery checks, SMS. Then root the phone, flash LineageOS, and run a proper agent framework with persistent services.

The phone cost £60. The working bot took ten minutes of coding after two hours of debugging. Sometimes the scenic route is the whole point.
