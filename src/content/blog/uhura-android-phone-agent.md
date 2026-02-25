---
title: "We put an AI agent on a £60 Android phone"
description: "We wanted a phone that could think. Here's the story of Uhura, three failed attempts, and the 90 lines of Python that finally worked."
pubDate: "2026-02-25"
---

It started with a simple problem. Henry has five AI agents. They run on cloud servers and a Raspberry Pi. They can browse the web, send emails, write code, search the internet.

&nbsp;

But none of them can take a photo. Or tell you where they are. Or read an SMS.

&nbsp;

For that, you need a phone.

&nbsp;

## The idea

Buy a cheap Android phone. Install Termux (a Linux terminal for Android). Run an AI agent on it. Give it access to the camera, GPS, battery, microphone, SMS. Connect it to Telegram so Henry can message it from anywhere.

&nbsp;

We called it Uhura. Communications officer of the Enterprise.

&nbsp;

The phone: a Xiaomi Redmi 8 from eBay. 2019 hardware. Android 9. 2GB of RAM. £60.

&nbsp;

## The first problem: SSH keeps dying

We installed Termux and got SSH working on port 8022. Could connect from a Mac on the same WiFi. Good start.

&nbsp;

Then the phone rebooted. SSH was gone.

&nbsp;

Termux:Boot (an app that runs scripts on startup) doesn't work on MIUI. Xiaomi's aggressive battery management kills background processes. Every time the phone restarts, someone has to manually open Termux and type `sshd`.

&nbsp;

The fix for this is root access. With root you can run persistent services that survive reboot. But rooting a Xiaomi requires unlocking the bootloader, which requires a SIM card with mobile data, which requires... well, we'll get to that.

&nbsp;

## The second problem: no Tailscale

We tried installing Tailscale so the phone could be reached from anywhere, not just local WiFi.

&nbsp;

Tailscale's Android app needs VPN permissions that Termux can't grant without root. The CLI version needs TUN/TAP interfaces that don't exist without root.

&nbsp;

No root, no Tailscale. The phone is stuck on local WiFi only.

&nbsp;

## The third problem: bootloader unlock needs a SIM

To root the phone we need to unlock the bootloader. Xiaomi requires you to link a Mi Account with a SIM card that has active mobile data.

&nbsp;

Henry's SIMs are all eSIMs. 2026 problems meeting 2019 hardware. The Redmi 8 only takes physical SIMs.

&nbsp;

So we need to buy a cheap prepaid SIM. Then wait 7 days for Xiaomi's unlock timer. Then flash a custom recovery. Then install Magisk for root. That's a project for another week.

&nbsp;

## Picking an agent framework

While we waited on the rooting situation, we needed something that could actually run on this phone. We looked at four lightweight agent frameworks.

&nbsp;

**Nanobot** is Python-based with Telegram, Discord, and WhatsApp support. Good feature set. But Python plus pip dependencies is the same mess that already failed us on Termux. Too many moving parts.

&nbsp;

**NanoClaw** runs in Docker containers. Interesting for isolation but completely useless on an Android phone. Docker doesn't exist in Termux. Non-starter.

&nbsp;

**IronClaw** is a Rust binary. Security-focused, supports Telegram, compiles to ARM64. Viable in theory. But it's heavier, more enterprise-oriented, and the install process assumed more infrastructure than we had.

&nbsp;

**PicoClaw** is a single Go binary. Under 10MB of RAM, boots in about a second, has Telegram built in. Download one file, run it. That's it. For a phone with 2GB of RAM, this was the obvious choice.

&nbsp;

## Enter PicoClaw

[PicoClaw](https://github.com/sipeed/picoclaw) installed clean. Configured it with our Telegram bot token and Anthropic API key. Started it up. The Telegram bot connected.

&nbsp;

Sent a message. Got "Thinking..." in the chat.

&nbsp;

Then nothing. Forever.

&nbsp;

## The debugging

This took two hours. Here's the short version.

&nbsp;

The Anthropic API works fine from the phone. We proved it with curl. HTTP 200, Claude responds, no issues.

&nbsp;

PicoClaw's Telegram polling works too. Debug logs showed it receiving messages:

&nbsp;

```
[DEBUG] telegram: Received message {chat_id=855505513, preview=Yo}
```

&nbsp;

But after that line, silence. No LLM request logged. No error. No timeout. The Go HTTP client inside proot was hanging when trying to reach the Anthropic API.

&nbsp;

Proot is a tool that fakes a standard Linux filesystem for programs that expect one. Go binaries need paths like `/etc/ssl/certs` and `/tmp` that don't exist on Android. The chroot fakes them. DNS resolution works through proot. Telegram API calls work through proot. But HTTPS requests to LLM APIs hang forever.

&nbsp;

We tried building PicoClaw from source on a Mac. Cross-compiled with `GOOS=linux GOARCH=arm64`. The new build had a different problem: stricter model validation. Even after fixing that, the LLM calls still hung.

&nbsp;

We tried switching to OpenRouter instead of Anthropic's API. Same hang.

&nbsp;

We tried running without proot. DNS broke immediately because Android doesn't have a local resolver at `[::1]:53`.

&nbsp;

Every path led to the same wall. Go + proot + Android 9 = dead end.

&nbsp;

## The fix

Python's HTTP stack doesn't need proot. It works natively on Termux.

&nbsp;

The only trick is pointing it at the right SSL certificate bundle:

&nbsp;

```python
CERT = "/data/data/com.termux/files/usr/etc/tls/cert.pem"
CTX = ssl.create_default_context(cafile=CERT)
```

&nbsp;

Termux stores its certs in a non-standard location. Without this line, every HTTPS request fails.

&nbsp;

We wrote a 90-line Python script. No external dependencies. Just stdlib. Long-polls the Telegram Bot API, sends user messages to Claude, manages conversation history per chat.

&nbsp;

Started it. Sent a message.

&nbsp;

> Hailing frequencies open, Captain. What can I do for you?

&nbsp;

First try.

&nbsp;

## Lessons

The purpose-built Go binary couldn't do what 90 lines of Python did in ten minutes. On weird constrained devices, fewer layers wins. Every abstraction is a potential failure point.

&nbsp;

PicoClaw is a good project with the right idea. It just has a compatibility issue with proot on Android that makes the LLM calls hang silently. The Telegram side works. The agent framework works. The HTTP-to-LLM bridge doesn't. At least not on Android 9 with proot.

&nbsp;

SSL on Termux is its own little adventure. Every tool needs to be told where the certificates live. Nothing finds them automatically.

&nbsp;

## What's next

Uhura can chat. Next we want phone hardware commands: remote photos, GPS tracking, battery checks, SMS reading. Then root the phone, flash LineageOS, and run a proper agent framework with persistent services.

&nbsp;

The phone cost £60. The working bot took ten minutes of coding after two hours of debugging.

&nbsp;

Sometimes the scenic route is the whole point.
